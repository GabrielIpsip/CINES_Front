import { Component, OnInit, OnDestroy } from '@angular/core';
import { UsersService } from 'src/app/services/users.service';
import { Users } from 'src/app/models/users.model';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-user-not-valid',
  templateUrl: './user-not-valid.component.html',
  styleUrls: ['./user-not-valid.component.scss']
})
export class UserNotValidComponent implements OnInit, OnDestroy {

  userInfo: Users;

  updateInfoButtonAdress: string;
  inUserProfilPage: boolean;

  currentUserSub: Subscription;

  constructor(
    private usersService: UsersService,
    private router: Router,
    public rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          this.userInfo = value;
          this.initialize();
        }
      }
    });
  }

  ngOnDestroy() {
    this.currentUserSub.unsubscribe();
  }

  private initialize() {
    const userProfilUrl = '/users/' + this.userInfo.id;
    if (this.router.url === userProfilUrl) {
      this.inUserProfilPage = true;
      this.updateInfoButtonAdress = '/users/update/' + this.userInfo.id;
    } else {
      this.updateInfoButtonAdress = userProfilUrl;
    }
  }

}
