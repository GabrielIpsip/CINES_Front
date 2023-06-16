import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RolesEnum } from '../common/roles-enum.enum';
import { RightsCheckerService } from '../services/rights-checker.service';

@Injectable({
  providedIn: 'root'
})
export class RightsCheckerGuard implements CanActivate {

  constructor(
    private rightsChecker: RightsCheckerService,
    private router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    const roles: Array<RolesEnum> = next.data.roles;

    if (roles != null && roles.length > 0 && roles.indexOf(RolesEnum.CURRENT_USER) > -1) {
      const id = next.params.id;
      if (id != null && this.rightsChecker.canActivate(roles, id)) {
        return true;
      }
    }

    if (this.rightsChecker.canActivate(roles)) {
      return true;
    }

    this.redirectNotFound();
    return false;
  }

  redirectNotFound() {
    this.router.navigateByUrl('/not-authorized');
  }

}
