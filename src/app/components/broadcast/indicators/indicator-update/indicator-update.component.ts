import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { Subscription } from 'rxjs';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { BodyIndicators, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { IndicatorViewComponent } from '../indicator-view/indicator-view.component';

@Component({
  selector: 'app-indicator-update',
  templateUrl: './indicator-update.component.html',
  styleUrls: ['./indicator-update.component.scss']
})
export class IndicatorUpdateComponent implements OnInit, ConfirmBeforeQuit, OnDestroy {

  @ViewChild('indicatorView') indicatorView: IndicatorViewComponent;

  indicator: Indicators;

  initialIndicateurValue: BodyIndicators;

  canQuit = false;
  routerSub: Subscription;

  jsonResponse: any = {};
  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  constructor(
    private indicatorsServive: IndicatorsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private rightsChecker: RightsCheckerService
  ) {
    this.routerSub = this.router.events.subscribe(() => {
      if (this.indicatorView == null || this.canQuit === true) {
        return;
      }

      this.canQuit = JSON.stringify(this.initialIndicateurValue) === JSON.stringify(this.indicatorView.getNewValues());
    });
  }

  get isADMIN(): boolean {
    return this.rightsChecker.isADMIN();
  }

  get isValidForm(): boolean {
    if (this.indicatorView == null) {
      return false;
    } else {
      return this.indicatorView.indicatorForm.valid;
    }
  }

  ngOnInit() {
    const indicatorId = this.activatedRoute.snapshot.params.id;
    this.indicatorsServive.getIndicator(indicatorId, null, false, true).subscribe({
      next: (response) => {
        this.indicator = response;
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });

    this.initJsonEditor();
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  updateIndicator() {
    const indicatorBody = this.indicatorView.getNewValues();
    this.indicatorsServive.updateIndicator(this.indicator.id, indicatorBody).subscribe({
      next: () => {
        this.canQuit = true;
        this.router.navigateByUrl('/indicators/list');
      }
    });
  }

  setInitialIndicatorValue(indicator: BodyIndicators) {
    this.initialIndicateurValue = indicator;
  }

  onClickSaveAndTestButton() {
    const indicatorBody = this.indicatorView.getNewValues();
    this.indicatorsServive.updateIndicator(this.indicator.id, indicatorBody, true).subscribe({
      next: (response) => this.jsonResponse = response.result
    });
  }

  private initJsonEditor() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'view';
  }
}
