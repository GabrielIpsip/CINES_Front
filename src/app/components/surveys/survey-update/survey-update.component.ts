import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { SurveyViewComponent } from '../survey-view/survey-view.component';
import { Surveys } from 'src/app/models/surveys.model';
import { SurveysService } from 'src/app/services/surveys.service';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-survey-update',
  templateUrl: './survey-update.component.html',
  styleUrls: ['./survey-update.component.scss']
})
export class SurveyUpdateComponent implements OnInit, AfterViewChecked, OnDestroy, ConfirmBeforeQuit {

  @ViewChild(SurveyViewComponent)
  surveyView: SurveyViewComponent;

  surveyId: number;
  surveyToUpdate: Surveys;
  oldSurveyInfo: Surveys;

  canQuit = false;

  constructor(
    private surveysService: SurveysService,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private location: Location,
    private esgbuService: ESGBUService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.surveyToUpdate = this.surveysService.getStoredSurvey();
    this.surveyId = this.surveyToUpdate.id;
    this.oldSurveyInfo = Object.assign({}, this.surveyToUpdate);
    this.esgbuService.setTitle(this.surveyToUpdate.name);
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  updateSurvey() {
    const newSurvey: Surveys = this.surveyView.getNewValues();
    this.surveysService.updateSurvey(this.surveyId, newSurvey).subscribe({
      next: (response) => {
        this.surveyToUpdate = response;
        this.canQuit = true;
        this.router.navigate(['/surveys/' + this.surveyId]);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorPopup();
        }
      }
    });
  }

  onGoBack() {
    this.checkModifBeforeQuit();
    this.location.back();
  }

  onClickButtonModifVar() {
    this.checkModifBeforeQuit();
    this.router.navigateByUrl('/surveys/update/groups/' + this.surveyId);
  }

  errorPopup() {
    this.translate.stream('error.uniqueSurvey').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  private checkModifBeforeQuit() {
    const newSurvey = new Surveys(this.surveyView.getNewValues());
    this.canQuit = newSurvey.equals(this.oldSurveyInfo);
  }

}
