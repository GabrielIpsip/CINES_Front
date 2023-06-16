import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { UserViewComponent } from '../user-view/user-view.component';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.scss']
})
export class UserUpdateComponent implements OnInit, AfterViewChecked, OnDestroy, ConfirmBeforeQuit {

  @ViewChild(UserViewComponent)
  userView: UserViewComponent;

  userId: number;
  userToUpdate: Users;
  oldUserInfo: Users;

  canQuit = false;

  constructor(
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private esgbuService: ESGBUService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    public confirmDialog: MatDialog
  ) { }

  ngOnInit() {
    this.userId = +this.activatedRoute.snapshot.params.id;
    this.usersService.getUser(this.userId).subscribe({
      next: (response) => {
        this.userToUpdate = response;
        this.oldUserInfo = Object.assign({}, response);
        this.esgbuService.setTitle(this.userToUpdate.eppn);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  updateUser() {
    const newUser: Users = new Users(this.userView.getNewValues());
    if (newUser.equals(this.oldUserInfo)) {
      this.navigateToConsultUserPage();
      return;
    }
    this.usersService.updateUser(newUser, this.userId).subscribe({
      next: (response) => {
        this.userToUpdate = response;
        this.updateCurrentUser();
        this.navigateToConsultUserPage();
        if (newUser.mail !== this.oldUserInfo.mail) {
          this.updateMailPopup();
        } else {
          this.updatePopup();
        }
      },
      error: (error) => {
        if (error.status === 409) {
          this.uniqueErrorPopup();
        }
        if (error.status === 403) {
          this.forbiddenError();
          this.navigateToConsultUserPage();
        }
      }
    });
  }

  navigateToConsultUserPage() {
    this.canQuit = true;
    this.router.navigate(['/users/' + this.userId]);
  }

  uniqueErrorPopup() {
    this.translate.stream('error.uniqueEppn').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  forbiddenError() {
    this.translate.stream('error.forbiddenErrorUser').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  onDeleteUser() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent,
      { data: { title: 'info.continue?', message: 'user.deleteMessage' } });
    confirmDialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.deleteUser();
        }
      }
    });
  }

  private deleteUser() {
    this.usersService.deleteUser(this.userId).subscribe({
      next: () => {
        this.canQuit = true;
        this.router.navigateByUrl('/users/list');
      }
    });
  }

  private updateCurrentUser() {
    const currentUser = this.usersService.getCurrentUserInfo();
    if (currentUser == null) {
      return;
    }
    if (currentUser.id === this.userId) {
      this.usersService.initializeCurrentUser();
    }
  }

  private updatePopup() {
    this.translate.stream('user.updatePopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  private updateMailPopup() {
    this.translate.stream('user.updateMailPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 10000 })
    });
  }
}
