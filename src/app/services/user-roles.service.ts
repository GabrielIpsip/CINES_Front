import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { UserRoles } from '../models/user-roles.model';
import { catchError } from 'rxjs/operators';
import { RolesEnum } from '../common/roles-enum.enum';
import { Users } from '../models/users.model';

interface BodyUserRole {
  roleId: number;
  docStructId: number;
  userId: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserRolesService {

  private readonly baseUrl = 'user-roles';

  private currentRole: RolesEnum[];
  private currentUserRole: UserRoles[];

  constructor(
    private esgbuApi: EsgbuApiService<UserRoles>,
  ) { }

  getAllUserRoles(userId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?userId=' + userId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllUserRolesByDocStruct(docStructId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?docStructId=' + docStructId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createRole(roleId: number, docStructId: number, userId: number) {
    const body = this.convertUserRoleToPost(roleId, docStructId, userId);
    return this.esgbuApi.post(this.baseUrl, body);
  }

  deleteRole(id: number) {
    return this.esgbuApi.delete(this.baseUrl + '/' + id);
  }

  getCurrentRole(): RolesEnum[] {
    if (this.currentRole?.length > 0) {
      return this.currentRole;
    }
    return JSON.parse(localStorage.getItem('role'));
  }

  getCurrentUserRole(): UserRoles[] {
    if (this.currentUserRole != null) {
      return this.currentUserRole;
    }
    return JSON.parse(localStorage.getItem('userRole'));
  }

  updateCurrentRole(user: Users) {
    if (user == null || user.id == null || user.id < 1) {
      return;
    }

    this.currentRole = [];
    this.getAllUserRoles(user.id).subscribe({
      next: (currentRoles: UserRoles[]) => {
        for (const userRole of currentRoles) {
          const roleName = userRole.role.name;
          if (this.currentRole.indexOf(RolesEnum[roleName]) === -1) {
            this.currentRole.push(RolesEnum[roleName]);
          }
        }
        localStorage.setItem('role', JSON.stringify(this.currentRole));
        localStorage.setItem('userRole', JSON.stringify(currentRoles));
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  private convertUserRoleToPost(roleIdP: number, docStructIdP: number, userIdP: number): BodyUserRole {
    return {
      roleId: roleIdP,
      docStructId: docStructIdP,
      userId: userIdP
    };
  }
}
