import { Injectable } from '@angular/core';
import { Operations } from '../models/operations.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';
import { Constraints } from '../models/constraints.model';

@Injectable({
  providedIn: 'root'
})
export class OperationsService {

  private readonly baseUrl = 'operations';

  constructor(
    private esgbuApi: EsgbuApiService<Operations>
  ) { }

  updateOperationInformation(id: number, operationInfo: Constraints) {
    return this.esgbuApi.put(this.baseUrl + '/' + id, operationInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createOperationInformation(operationInfo: Constraints) {
    return this.esgbuApi.post(this.baseUrl, operationInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }

}
