import { Injectable } from '@angular/core';
import { RolesEnum } from '../common/roles-enum.enum';
import { UserRolesService } from './user-roles.service';
import { Router } from '@angular/router';
import { UsersService } from './users.service';

@Injectable({
  providedIn: 'root'
})
export class RightsCheckerService {

  constructor(
    private userRoleService: UserRolesService,
    private router: Router,
    private usersService: UsersService
  ) { }

  canActivate(roles: Array<RolesEnum>, id: number = null) {

    // Check if authorized for current user
    if (id != null && roles.indexOf(RolesEnum.CURRENT_USER) > -1) {
      const currentUserInfo = this.usersService.getCurrentUserInfo();
      if (currentUserInfo != null && currentUserInfo.id != null && currentUserInfo.id == id) {
        return true;
      }
    }

    const currentRoles = this.userRoleService.getCurrentRole();

    if (currentRoles == null || currentRoles.length === 0) {
      return false;
    }

    // Check if have good role
    for (const currentRole of currentRoles) {
      if (roles.indexOf(currentRole) > -1) {
        return true;
      }
    }

    return false;
  }

  disabled(routeUrl: string, id: number = null) {
    const routes = this.router.config;

    if (routes == null || routes.length === 0) {
      return false;
    }

    if (routeUrl.charAt(0) === '/') {
      routeUrl = routeUrl.substr(1);
    }

    for (const route of routes) {
      if (route.path == null || route.path !== routeUrl) {
        continue;
      }

      if (route.data == null || route.data.roles == null || route.data.roles.length === 0) {
        return false;
      }

      if (id != null) {
        return !this.canActivate(route.data.roles, id);
      }

      return !this.canActivate(route.data.roles);
    }
    return true;
  }

  hasRole(roles: RolesEnum[]): boolean {
    const currentRoles = this.userRoleService.getCurrentRole();
    for (const role of roles) {
      if (currentRoles.indexOf(role) > -1) {
        return true;
      }
    }
    return false;
  }

  isADMIN(readOnly = false): boolean {
    const currentRole = this.userRoleService.getCurrentRole();

    if (currentRole == null) {
      return false;
    }

    for (const role of currentRole) {
      if (role === RolesEnum.ADMIN || (readOnly && role === RolesEnum.ADMIN_RO)) {
        return true;
      }
    }
    return false;
  }

}
