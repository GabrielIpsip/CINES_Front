import { KeyValue } from '@angular/common';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { PhysicalLibraryLinkHistory } from 'src/app/models/physical-library-link-history.model';
import { Surveys } from 'src/app/models/surveys.model';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { PhysicalLibraryLinkHistoryService } from 'src/app/services/physical-library-link-history.service';

@Component({
  selector: 'app-documentary-structure-physic-lib-list',
  templateUrl: './documentary-structure-physic-lib-list.component.html',
  styleUrls: ['./documentary-structure-physic-lib-list.component.scss']
})
export class DocumentaryStructurePhysicLibListComponent implements OnInit, OnChanges {

  @Input() docStructId: number;
  @Input() surveys: Surveys[];

  physicLibList: PhysicalLibraries[];
  surveyList = new Map<number, Surveys>();
  physicLibHistory = new Map<number, PhysicalLibraryLinkHistory[]>();

  lastSurvey: Surveys;

  showNoPhysicLibMessage = false;

  constructor(
    private physicLibService: PhysicalLibrariesService,
    private physicLibLinkHistoryService: PhysicalLibraryLinkHistoryService
  ) { }

  ngOnInit() {
    this.physicLibService.getAllByDocStructId(this.docStructId).subscribe({
      next: (response) => this.physicLibList = response,
      error: (error) => {
        if (error.status === 404) {
          this.showNoPhysicLibMessage = true;
        }
      }
    });

    this.physicLibLinkHistoryService.getLinkHistoryByDocStruct(this.docStructId).subscribe({
      next: (response) => {
        for (const historyLine of response) {
          if (this.physicLibHistory.has(historyLine.surveyId)) {
            this.physicLibHistory.get(historyLine.surveyId).push(historyLine);
          } else {
            this.physicLibHistory.set(historyLine.surveyId, [historyLine]);
          }
        }
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  ngOnChanges() {
    if (this.surveyList.size > 0 || this.surveys == null || this.lastSurvey != null) {
      return;
    }

    this.lastSurvey = this.surveys[0];
    for (const survey of this.surveys.slice(1)) {
      this.surveyList.set(survey.id, survey);
    }
  }

  keyDescOrder(a: KeyValue<number, PhysicalLibraryLinkHistory[]>,
               b: KeyValue<number, PhysicalLibraryLinkHistory[]>): number {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

}
