import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanDeactivate } from '@angular/router';
import { Observable } from 'rxjs';
import { HomeComponent } from '../components/home/home.component';
import { UsersService } from '../services/users.service';

@Injectable({
  providedIn: 'root'
})
export class FirstConnectionGuard implements CanDeactivate<HomeComponent> {

  constructor(
    private usersService: UsersService
  ) { }

  canDeactivate(
    component: HomeComponent,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser = this.usersService.getCurrentUserInfo();
    if (currentUser && currentUser.id && currentUser.id == 1) {

      return nextState.url === '/about' ||
        nextState.url === '/cgu' ||
        nextState.url === '/credits' ||
        nextState.url === '/rgpd' ||
        nextState.url === '/contact' ||
        nextState.url === '/useful-links';

    } else {
      return true;
    }
  }

}
