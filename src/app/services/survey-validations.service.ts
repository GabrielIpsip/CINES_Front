import { Injectable } from '@angular/core';
import { SurveyValidations } from '../models/survey-validations.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';

interface BodySurveyValidation {
  valid: boolean;
  surveyId: number;
  docStructId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SurveyValidationsService {

  private readonly baseUrl = 'survey-validations';

  constructor(
    private esgbuApi: EsgbuApiService<SurveyValidations>,
  ) { }

  getAllSurveyValidation(surveyId?: number, establishmentId?: number, docStructId?: number | string) {
    let url = this.baseUrl;

    if (surveyId || establishmentId || docStructId) {
      url += '?';
    }

    if (surveyId) {
      url += 'surveyId=' + surveyId;
    }

    if (establishmentId) {
      if (surveyId) {
        url += '&';
      }
      url += 'establishmentId=' + establishmentId;
    }

    if (docStructId) {
      if (surveyId || establishmentId) {
        url += '&';
      }
      url += 'docStructId=' + docStructId;
    }

    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  validSurveyForDocStruct(validP: boolean, surveyIdP: number, docStructIdP: number) {
    const body: BodySurveyValidation = {
      valid: validP,
      surveyId: surveyIdP,
      docStructId: docStructIdP
    };

    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

}
