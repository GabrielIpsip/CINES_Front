import { Injectable } from '@angular/core';
import { Roles } from '../models/roles.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private readonly baseUrl = 'roles';

  constructor(
    private esgbuApi: EsgbuApiService<Roles>
  ) { }

  getAllRoles() {
    return this.esgbuApi.getAll(this.baseUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

}
