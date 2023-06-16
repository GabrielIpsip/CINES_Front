import { Component, OnInit, OnDestroy } from '@angular/core';
import { Surveys } from 'src/app/models/surveys.model';
import { SurveysService } from 'src/app/services/surveys.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { DateTools } from 'src/app/utils/date-tools';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-survey-consult',
  templateUrl: './survey-consult.component.html',
  styleUrls: ['./survey-consult.component.scss']
})
export class SurveyConsultComponent implements OnInit, OnDestroy {

  private surveyId: number;

  survey: Surveys;

  constructor(
    private surveysService: SurveysService,
    private activatedRoute: ActivatedRoute,
    private datePipe: DatePipe,
    private esgbuService: ESGBUService,
    private router: Router,
    public rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.surveyId = this.activatedRoute.snapshot.params.id;
    this.surveysService.getSurvey(this.surveyId).subscribe(response => {
      this.surveysService.setStoredSurvey(response);
      const dateTools = new DateTools(this.datePipe);
      this.survey = response;
      this.survey.start = dateTools.strToDate(this.survey.start).toDateString();
      this.survey.end = dateTools.strToDate(this.survey.end).toDateString();
      this.survey.creation = dateTools.strToDate(this.survey.creation).toDateString();
      this.esgbuService.setTitle(this.survey.name);
    });
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  onOpenCreate(survey: Surveys) {
    this.surveysService.setStoredSurvey(survey);
    this.router.navigate(['/surveys/create']);
  }

  onClickUpdate(survey: Surveys) {
    this.router.navigateByUrl('/surveys/update/' + survey.id);
    this.surveysService.setStoredSurvey(survey);
  }

}
