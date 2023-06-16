import { Component, OnInit, Input } from '@angular/core';
import { Administrations } from 'src/app/models/administrations.model';
import { SurveysService } from 'src/app/services/surveys.service';
import { Surveys } from 'src/app/models/surveys.model';
import { DataValuesService } from 'src/app/services/data-values.service';
import { StatesEnum } from 'src/app/common/statesEnum.enum';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-survey-reply-button',
  templateUrl: './survey-reply-button.component.html',
  styleUrls: ['./survey-reply-button.component.scss']
})
export class SurveyReplyButtonComponent implements OnInit {

  @Input() administration: Administrations;
  surveys: Surveys[];
  stateEnum = StatesEnum;

  constructor(
    private surveysService: SurveysService,
    private dataValuesService: DataValuesService,
    public rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.surveysService.getAllSurvey().subscribe(response => {
      if (response.length > 0) {
        this.surveys = response;
      }
    });
  }

  onClickReplyButton(survey: Surveys) {
    this.dataValuesService.setAdministration(this.administration);
    this.dataValuesService.setSurvey(survey);
  }

}
