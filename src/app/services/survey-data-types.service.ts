import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { SurveyDataTypes } from '../models/survey-data-types.model';

interface BodyPatchSurveyDataType {
  active: boolean;
}

interface BodyPostSurveyDataType {
  active: boolean;
  surveyId: number;
  dataTypeId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyDataTypesService {

  private readonly baseUrl = 'survey-data-types';

  constructor(
    private esgbuApi: EsgbuApiService<SurveyDataTypes>
  ) { }

  getAllBySurveyId(surveyId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?surveyId=' + surveyId);
  }

  updateRelation(surveyId: number, dataTypeId: number, activep: boolean) {
    const body: BodyPatchSurveyDataType = { active: activep };
    return this.esgbuApi.patch(this.baseUrl + '/' + surveyId + '/' + dataTypeId, body);
  }

  getRelation(surveyId: number, dataTypeId: number) {
    return this.esgbuApi.get(this.baseUrl + '?surveyId=' + surveyId + '&dataTypeId=' + dataTypeId);
  }

  createRelation(surveyIdp: number, dataTypeIdp: number, activep: boolean) {
    const body: BodyPostSurveyDataType = {
      surveyId: surveyIdp,
      dataTypeId: dataTypeIdp,
      active: activep
    };
    return this.esgbuApi.post(this.baseUrl, body);
  }
}
