import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ActiveHistory } from 'src/app/models/active-history.model';
import { Administrations } from 'src/app/models/administrations.model';
import { Surveys } from 'src/app/models/surveys.model';
import { ActiveHistoryService } from 'src/app/services/active-history.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

class ActiveToggleInfo {
  default: boolean;
  active: boolean;
}

@Component({
  selector: 'app-administration-active-history',
  templateUrl: './administration-active-history.component.html',
  styleUrls: ['./administration-active-history.component.scss']
})
export class AdministrationActiveHistoryComponent implements OnInit, OnChanges {

  @Input() administration: Administrations;
  @Input() surveys: Surveys[];

  isDiCoDoc = false;

  activeHistory = new Map<number, ActiveToggleInfo>();
  initialized = false;

  constructor(
    private activeHistoryService: ActiveHistoryService,
    private rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.isDiCoDoc = this.rightsChecker.isADMIN();
  }

  ngOnChanges() {
    if (!this.initialized && this.surveys != null && this.administration != null && this.administration.id != null) {
      this.initialized = true;
      this.activeHistoryService.getActiveHistory(this.administration.TYPE_NAME, this.administration.id).subscribe({
        next: (response) => this.fillActiveHistoryMap(response),
        error: (error) => {
          if (error.status === 404) {
            this.fillActiveHistoryMap();
          }
        }
      });
    }
  }

  onChangeToggle(event: MatSlideToggleChange, surveyId: number) {
    this.activeHistory.get(surveyId).default = false;
    this.activeHistoryService
      .createOrUpdateActiveHistory(this.administration.TYPE_NAME, surveyId, this.administration.id, event.checked)
      .subscribe({
        next: (response) => {
          this.administration.active = response.administration.active;
          for (const [, activeToggleInfo] of this.activeHistory) {
            if (activeToggleInfo.default) {
              activeToggleInfo.active = response.administration.active;
            }
          }
        }
      });
  }

  private fillActiveHistoryMap(activeHistory?: ActiveHistory[]) {
    if (activeHistory != null) {
      for (const historyLine of activeHistory) {
        this.activeHistory.set(historyLine.surveyId, { default: false, active: historyLine.active });
      }
    }

    for (const survey of this.surveys) {
      if (!this.activeHistory.has(survey.id)) {
        this.activeHistory.set(survey.id, { default: true, active: this.administration.active });
      }
    }
  }

}
