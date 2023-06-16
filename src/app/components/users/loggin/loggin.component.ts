import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/users.model';
import { Observable, Subscription } from 'rxjs';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loggin',
  templateUrl: './loggin.component.html',
  styleUrls: ['./loggin.component.scss']
})
export class LogginComponent implements OnInit, OnDestroy {

  currentUser: Observable<Users>;
  useName: string;

  private currentUserSub: Subscription;

  constructor(
    private usersService: UsersService,
    private userRoleService: UserRolesService,
    private router: Router
  ) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.currentUser = this.usersService.getCurrentUser();
    this.initUserInfo();
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

  login() {
    this.usersService.login('/');
  }

  logout() {
    this.usersService.logout('/');
  }

  private initUserInfo() {
    this.currentUserSub = this.currentUser.subscribe({
      next: (user) => {
        this.initUseName(user);
        this.initUserRole(user);
      }
    });
  }

  private initUseName(user: Users) {
    if (this.currentUser == null) {
      return null;
    }
    this.useName = this.generateName(user);
  }

  private initUserRole(user: Users) {
    if (this.currentUser == null) {
      return;
    }
    this.userRoleService.updateCurrentRole(user);
  }

  private generateName(user: Users): string {
    let name = '';
    if (user == null) {
      return null;
    }

    if (user.firstname) {
      name = user.firstname;
    }

    if (user.lastname) {
      if (name.length > 0) {
        name += ' ';
      }
      name += user.lastname;
    }

    if (name.length === 0) {
      name = user.eppn;
    }

    return name;
  }

}
