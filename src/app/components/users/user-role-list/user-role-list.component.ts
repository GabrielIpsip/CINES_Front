import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Roles } from 'src/app/models/roles.model';
import { RolesService } from 'src/app/services/roles.service';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { UserRoles } from 'src/app/models/user-roles.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryDocStructSearchDialogComponent } from '../../physical-libraries/physical-library-doc-struct-search-dialog/physical-library-doc-struct-search-dialog.component';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-user-role-list',
  templateUrl: './user-role-list.component.html',
  styleUrls: ['./user-role-list.component.scss']
})
export class UserRoleListComponent implements OnInit {

  @Input() userId: number;
  @Input() editMode = false;
  @Input() firstConnection = false;

  disabledAddRole = true;
  @Output() disabledAddRoleEvent = new EventEmitter<boolean>(this.disabledAddRole);

  disabledDocStruct = true;
  docStruct: DocumentaryStructures;

  roleList: Roles[];
  userRoleList: UserRoles[];
  currentRole: Roles;

  userRoleForm: FormGroup = new FormGroup({
    roleForm: new FormControl('', [Validators.required]),
    docStructForm: new FormControl('', [])
  });

  constructor(
    private rolesService: RolesService,
    private userRolesService: UserRolesService,
    private usersService: UsersService,
    public dialog: MatDialog,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.userRoleForm.controls.docStructForm.disable();
    if (this.editMode) {
      this.initAllRole();
    }
    if (!this.firstConnection) {
      this.initAllUserRole();
    }
  }

  onAddUserRole() {
    const docStructId = (this.docStruct) ? this.docStruct.id : null;
    this.userRolesService.createRole(this.currentRole.id, docStructId, this.userId).subscribe({
      next: (response) => {
        this.userRoleList.push(response);
        this.updateUserRole();
      },
      error: (error) => {
        if (error.status === 409) {
          this.errorAlreadyExistsRolePopup();
        } else if (error.status === 400) {
          this.errorNotValidUserPopup();
        }
      }
    });
  }

  getUserRoleValues(): UserRoles {
    const userRole = new UserRoles();
    userRole.role = this.currentRole;
    userRole.documentaryStructure = this.docStruct;
    return userRole;
  }

  onDeleteUserRole(id: number) {
    this.userRolesService.deleteRole(id).subscribe({
      next: () => {
        let i = 0;
        for (const userRole of this.userRoleList) {
          if (userRole.id === id) {
            this.userRoleList.splice(i, 1);
            this.updateUserRole();
            break;
          }
          i++;
        }
      }
    });
  }

  updateCurrentRole(event: MatOptionSelectionChange) {
    this.currentRole = event.source.value;
    this.refreshDisableDocStructButton();
    this.refreshDisableAddRoleButton();
    if (this.disabledDocStruct) {
      this.updateDocStructText('');
      this.docStruct = null;
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhysicalLibraryDocStructSearchDialogComponent, {
      data: { associated: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.docStruct = result;
        this.updateDocStructText(this.docStruct.useName);
        this.refreshDisableAddRoleButton();
      }
    });
  }

  private updateUserRole() {
    const currentUser = this.usersService.getCurrentUserInfo();
    if (currentUser != null && currentUser.id === this.userId) {
      this.userRolesService.updateCurrentRole(currentUser);
    }
  }

  private errorAlreadyExistsRolePopup() {
    this.translate.stream('error.uniqueRole').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  private errorNotValidUserPopup() {
    this.translate.stream('error.notValidUser').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  private initAllUserRole() {
    this.userRoleList = [];
    this.userRolesService.getAllUserRoles(this.userId).subscribe({
      next: (response) => this.userRoleList = response,
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  private initAllRole() {
    this.roleList = [];
    this.rolesService.getAllRoles().subscribe({
      next: (response) => {
        this.roleList = response;
        // Move DiCoDoc guest from position 4 to 1.
        const temp = this.roleList[4];
        this.roleList[4] = this.roleList[1];
        this.roleList[1] = temp;

        // Move survey resp from prosition 4 to 3.
        const temp2 = this.roleList[4];
        this.roleList[4] = this.roleList[3];
        this.roleList[3] = temp2;
      }
    });
  }

  private refreshDisableAddRoleButton() {
    const isValidWithoutDocStruct = this.userRoleForm.valid && !this.currentRole.associated;
    const isValidWithDocStruct = this.userRoleForm.valid && this.currentRole.associated && this.docStruct != null;
    this.disabledAddRole = !(isValidWithoutDocStruct || isValidWithDocStruct);
    this.disabledAddRoleEvent.emit(this.disabledAddRole);
  }

  private refreshDisableDocStructButton() {
    this.disabledDocStruct = !this.currentRole.associated;
  }

  private updateDocStructText(useName: string) {
    this.userRoleForm.controls.docStructForm.enable();
    this.userRoleForm.controls.docStructForm.setValue(useName);
    this.userRoleForm.controls.docStructForm.disable();
  }

}
