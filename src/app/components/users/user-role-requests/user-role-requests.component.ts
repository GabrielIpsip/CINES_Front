import { Component, OnInit } from '@angular/core';
import { UserRoleRequestsService } from 'src/app/services/user-role-requests.service';
import { UserRoleRequests } from 'src/app/models/user-role-requests.model';
import { TranslateService } from '@ngx-translate/core';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-role-requests',
  templateUrl: './user-role-requests.component.html',
  styleUrls: ['./user-role-requests.component.scss']
})
export class UserRoleRequestsComponent implements OnInit {

  requests: UserRoleRequests[];
  locale: string;

  constructor(
    private requestsService: UserRoleRequestsService,
    private translate: TranslateService,
    private userRoleService: UserRolesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.requests = [];
    this.locale = this.translate.getDefaultLang();
    this.requestsService.getAllRequests().subscribe({
      next: (response) => this.requests = response,
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  onAccept(request: UserRoleRequests) {
    const docStructId = (request.documentaryStructure) ? request.documentaryStructure.id : null;
    this.userRoleService.createRole(request.role.id, docStructId, request.user.id).subscribe({
      next: () => this.onDecline(request),
      error: (error) => {
        if (error.status === 409) {
          this.errorPopup();
        }
      }
    });
  }

  onDecline(request: UserRoleRequests) {
    this.requestsService.deleteRequest(request).subscribe({
      next: () => this.cleanRequest(request)
    });
  }

  cleanRequest(request: UserRoleRequests) {
    this.requests = this.requests.filter((value) => {
      return value.id !== request.id;
    });
  }

  errorPopup() {
    this.translate.stream('error.uniqueRole').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
