import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Numbers } from '../models/numbers.model';
import { catchError } from 'rxjs/operators';
import { Constraints } from '../models/constraints.model';

@Injectable({
  providedIn: 'root'
})
export class NumbersService {

  private readonly baseUrl = 'numbers';

  public readonly MAX = 999999999999;
  public readonly MIN = 0;
  public readonly IS_DECIMAL = false;

  constructor(
    private esgbuApi: EsgbuApiService<Numbers>
  ) { }

  getAllNumbersInformation(publicAPI = false, filterId?: number[]) {
    let filter = '';
    if (filterId != null) {
      filter += '?dataTypeId=';
      for (const id of filterId) {
        filter += id + ',';
      }
    }
    return this.esgbuApi.getAll(this.baseUrl + filter, publicAPI)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateNumberInformation(id: number, numberInfo: Constraints) {
    return this.esgbuApi.put(this.baseUrl + '/' + id, numberInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createNumberInformation(numberInfo: Constraints) {
    return this.esgbuApi.post(this.baseUrl, numberInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
