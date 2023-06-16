import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { UserViewComponent } from '../user-view/user-view.component';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-user-create',
  templateUrl: './user-create.component.html',
  styleUrls: ['./user-create.component.scss']
})
export class UserCreateComponent implements OnInit, AfterViewChecked, ConfirmBeforeQuit {

  @ViewChild(UserViewComponent)
  userView: UserViewComponent;

  userToCreate: Users;
  canQuit = false;

  constructor(
    private translate: TranslateService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.userToCreate = new Users();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  createUser() {
    const newUser: Users = this.userView.getNewValues();
    this.usersService.createUser(newUser).subscribe({
      next: (response) => {
        this.userToCreate = response;
        this.updatePopup();
        this.canQuit = true;
        this.router.navigate(['/users/' + this.userToCreate.id]);
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorPopup();
        }
      }
    });
  }

  errorPopup() {
    this.translate.stream('error.uniqueEppn').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  updatePopup() {
    this.translate.stream('user.createPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
