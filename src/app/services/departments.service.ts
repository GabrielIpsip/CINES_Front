import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Departments } from '../models/departments.model';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class DepartmentsService {

  private readonly baseUrl = 'departments';

  constructor(
    private esgbuApi: EsgbuApiService<Departments>
  ) { }

  public getAllDepartments(publicApi = false) {
    return this.esgbuApi.getAll(this.baseUrl, publicApi)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  public getDepartmentByPostalCode(postalCode: string) {
    return this.esgbuApi.get(this.baseUrl + '/' + postalCode)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
