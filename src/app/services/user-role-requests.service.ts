import { Injectable } from '@angular/core';
import { UserRoleRequests } from '../models/user-role-requests.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';

interface BodyUserRoleRequest {
  userId: number;
  roleId: number;
  docStructId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserRoleRequestsService {

  private readonly baseUrl = 'user-role-requests';

  constructor(
    private esgbuApi: EsgbuApiService<UserRoleRequests>
  ) { }

  getAllRequests() {
    return this.esgbuApi.getAll(this.baseUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  deleteRequest(request: UserRoleRequests) {
    return this.esgbuApi.delete(this.baseUrl + '/' + request.id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createRequest(userIdP: number, roleIdP: number, docStructIdP: number) {
    const body: BodyUserRoleRequest = {
      userId: userIdP,
      roleId: roleIdP,
      docStructId: docStructIdP
    };

    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

}
