import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { SurveyViewComponent } from '../survey-view/survey-view.component';
import { Surveys } from 'src/app/models/surveys.model';
import { Router } from '@angular/router';
import { SurveysService } from 'src/app/services/surveys.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Location } from '@angular/common';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-survey-create',
  templateUrl: './survey-create.component.html',
  styleUrls: ['./survey-create.component.scss']
})
export class SurveyCreateComponent implements OnInit, AfterViewChecked, ConfirmBeforeQuit {

  @ViewChild(SurveyViewComponent)
  surveyView: SurveyViewComponent;

  surveyToCreate: Surveys;

  canQuit = false;

  constructor(
    private surveysService: SurveysService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private location: Location
  ) { }

  ngOnInit() {
    const oldSurvey = this.surveysService.getStoredSurvey();
    if (oldSurvey) {
      this.surveyToCreate = oldSurvey;
    } else {
      this.surveyToCreate = new Surveys();
    }
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  createSurvey() {
    const newSurvey: Surveys = this.surveyView.getNewValues();
    this.surveysService.createSurvey(newSurvey).subscribe({
      next: (response) => {
        this.surveyToCreate = response;
        this.canQuit = true;
        this.router.navigate(['/surveys/' + this.surveyToCreate.id]);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorPopup();
        }
      }
    });
  }

  errorPopup() {
    this.translate.stream('error.uniqueSurvey').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  onGoBack() {
    this.location.back();
  }
}
