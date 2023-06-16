import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Surveys } from '../models/surveys.model';
import { catchError } from 'rxjs/operators';

interface BodySurvey {
  name: string;
  calendarYear: string;
  dataCalendarYear: string;
  start: string;
  end: string;
  instruction: string;
  stateId: number;
}

@Injectable({
  providedIn: 'root'
})
export class SurveysService {

  private readonly baseUrl = 'surveys';
  private storedSurvey: Surveys;

  constructor(
    private esgbuApi: EsgbuApiService<Surveys>
  ) { }

  getSurvey(id: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllSurvey(publicAPI = false) {
    return this.esgbuApi.getAll(this.baseUrl, publicAPI)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllOpenSurvey() {
    return this.esgbuApi.getAll(this.baseUrl + '?open=true')
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createSurvey(survey: Surveys) {
    const surveyPost = this.convertSurveyToPost(survey);
    return this.esgbuApi.post(this.baseUrl, surveyPost)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateSurvey(id: number, survey: Surveys) {
    const surveyPost = this.convertSurveyToPost(survey);
    return this.esgbuApi.put(this.baseUrl + '/' + id, surveyPost)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  setStoredSurvey(survey: Surveys) {
    if (survey != null) {
      this.storedSurvey = Object.assign({}, survey);
      localStorage.setItem('storedSurvey', JSON.stringify(this.storedSurvey));
    }
  }

  getStoredSurvey(): Surveys {
    if (this.storedSurvey == null) {
      this.setStoredSurvey(JSON.parse(localStorage.getItem('storedSurvey')));
    }
    return Object.assign({}, this.storedSurvey);
  }

  private convertSurveyToPost(survey: Surveys): BodySurvey {
    const postSurvey = {
      name: survey.name,
      calendarYear: survey.calendarYear,
      dataCalendarYear: survey.dataCalendarYear,
      start: survey.start,
      end: survey.end,
      instruction: survey.instruction,
      stateId: survey.state.id
    };
    return postSurvey;
  }

}
