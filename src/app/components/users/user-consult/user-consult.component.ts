import { Component, OnInit, OnDestroy } from '@angular/core';
import { Users } from 'src/app/models/users.model';
import { Subscription } from 'rxjs';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-consult',
  templateUrl: './user-consult.component.html',
  styleUrls: ['./user-consult.component.scss']
})
export class UserConsultComponent implements OnInit, OnDestroy {

  private userId: number;

  user: Users;
  private userSub: Subscription;
  currentUserSub: Subscription;

  isDiCoDoc = false;
  isCurrentUser: boolean;

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private esgbuService: ESGBUService,
    public rightsChecker: RightsCheckerService,
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.userId = +this.activatedRoute.snapshot.params.id;
    this.initIsCurrentUser();
    this.userSub = this.usersService.getUser(this.userId).subscribe({
      next: (response) => {
        this.user = response;
        this.esgbuService.setTitle(this.user.eppn);
      }
    });
  }

  ngOnDestroy() {
    this.userSub.unsubscribe();
    this.esgbuService.clearTitle();
    this.currentUserSub?.unsubscribe();
  }

  forceValidUser() {
    this.usersService.forceValidUser(this.userId).subscribe({
      next: (response) => this.user = response,
      error: () => this.snackBar.open(this.translate.instant('error.forceValidUser'))
    });
  }

  private initIsCurrentUser() {
    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          this.isCurrentUser = (this.userId === value.id);
          this.isDiCoDoc = this.rightsChecker.isADMIN();
        }
      }
    });
  }

}
