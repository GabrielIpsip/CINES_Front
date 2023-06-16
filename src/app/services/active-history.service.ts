import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { ActiveHistory } from '../models/active-history.model';
import { EsgbuApiService } from './esgbu-api.service';

interface BodyActiveHistory {
  administrationType: AdministrationTypesEnum;
  surveyId: number;
  administrationId: number;
  active: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ActiveHistoryService {

  private readonly baseUrl = 'active-history';

  constructor(
    private esgbuApi: EsgbuApiService<ActiveHistory>
  ) { }

  getActiveHistory(administrationType: AdministrationTypesEnum, administrationId: number) {
    return this.esgbuApi.getAll(
      this.baseUrl + '?administrationType=' + administrationType + '&administrationId=' + administrationId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createOrUpdateActiveHistory(administrationType: AdministrationTypesEnum, surveyId: number,
                              administrationId: number, active: boolean) {
    const body: BodyActiveHistory = {
      administrationType,
      surveyId,
      administrationId,
      active
    };

    return this.esgbuApi.put(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
