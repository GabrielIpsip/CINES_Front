import { Component, OnInit } from '@angular/core';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { SurveysService } from 'src/app/services/surveys.service';
import { Surveys } from 'src/app/models/surveys.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { RolesEnum } from 'src/app/common/roles-enum.enum';

@Component({
  selector: 'app-survey-consult-current',
  templateUrl: './survey-consult-current.component.html',
  styleUrls: ['./survey-consult-current.component.scss']
})
export class SurveyConsultCurrentComponent implements OnInit {

  isDiCoDoc: boolean;
  isDocStructUser: boolean;

  globalProgress: number;
  currentSurvey: Surveys;

  noSurveyCodeMessage: string;

  constructor(
    private rigthsChecker: RightsCheckerService,
    private establishmentsService: EstablishmentsService,
    private surveysService: SurveysService,
  ) { }

  ngOnInit() {
    this.isDiCoDoc = this.rigthsChecker.isADMIN(true);
    this.initCurrentSurvey();
    this.isDocStructUser = this.rigthsChecker
      .hasRole([RolesEnum.VALID_SURVEY_RESP, RolesEnum.SURVEY_ADMIN, RolesEnum.USER]);

    if (this.isDiCoDoc) {
      this.establishmentsService.getGlobalProgress().subscribe({
        next: (response) => {
          this.globalProgress = response.globalProgress;
          this.currentSurvey = response.survey;
        },
        error: () => this.globalProgress = 0
      });
    }

  }

  private initCurrentSurvey() {
    if (!this.isDiCoDoc) {
      this.surveysService.getAllOpenSurvey().subscribe({
        next: (response) => {
          if (response.length > 0) {
            this.currentSurvey = response[0];
          }
        },
        error: (error) => {
          if (error.status === 404) {
            this.noSurveyCodeMessage = 'error.noOpenSurveyFound';
          }
        }
      });
    }
  }

}
