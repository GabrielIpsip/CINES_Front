import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { Users } from 'src/app/models/users.model';
import { UsersService } from 'src/app/services/users.service';
import { UserViewComponent } from '../user-view/user-view.component';
import { UserRoleListComponent } from '../user-role-list/user-role-list.component';
import { UserRoles } from 'src/app/models/user-roles.model';
import { UserRoleRequestsService } from 'src/app/services/user-role-requests.service';

@Component({
  selector: 'app-first-connection',
  templateUrl: './first-connection.component.html',
  styleUrls: ['./first-connection.component.scss']
})
export class FirstConnectionComponent implements OnInit, AfterViewChecked {

  isLinear = true;
  user = new Users();
  userRole: UserRoles;
  disabledAddRole = true;

  @ViewChild(UserViewComponent)
  userView: UserViewComponent;

  @ViewChild(UserRoleListComponent)
  roleView: UserRoleListComponent;

  constructor(
    private userService: UsersService,
    private requestService: UserRoleRequestsService,
    private cdRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.user = this.userService.getCurrentUserInfo();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onAcceptCondition(stepper: MatStepper) {
    stepper.steps.first.completed = true;
    stepper.next();
  }

  onCreateUser(stepper: MatStepper) {
    this.user = this.userView.getNewValues();
    stepper.steps.toArray()[1].completed = true;
    stepper.next();
  }

  onCreateRole(stepper: MatStepper) {
    this.userRole = this.roleView.getUserRoleValues();
    stepper.steps.toArray()[2].completed = true;
    stepper.next();
  }

  onDisableButton(disable: boolean) {
    this.disabledAddRole = disable;
  }

  onConfirm() {
    this.userService.createUser(this.user).subscribe({
      next: (response) => {
        this.user = response;
        this.sendRoleRequest();
      }
    });
  }

  private sendRoleRequest() {
    const docStructId = (this.userRole.documentaryStructure != null) ? this.userRole.documentaryStructure.id : null;
    this.requestService.createRequest(this.user.id, this.userRole.role.id, docStructId)
      .subscribe({
        next: () => this.userService.initializeCurrentUser()
      });
  }
}
