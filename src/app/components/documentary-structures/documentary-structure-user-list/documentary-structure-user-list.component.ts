import { Component, Input, OnInit } from '@angular/core';
import { RolesEnum } from 'src/app/common/roles-enum.enum';
import { UserRoles } from 'src/app/models/user-roles.model';
import { UserRolesService } from 'src/app/services/user-roles.service';

@Component({
  selector: 'app-documentary-structure-user-list',
  templateUrl: './documentary-structure-user-list.component.html',
  styleUrls: ['./documentary-structure-user-list.component.scss']
})
export class DocumentaryStructureUserListComponent implements OnInit {

  @Input() docStructId: number;

  userRoles: UserRoles[] = [];
  noUserRoles = false;

  roleEnum = RolesEnum;

  constructor(
    private userRolesService: UserRolesService
  ) { }

  ngOnInit() {
    this.userRolesService.getAllUserRolesByDocStruct(this.docStructId).subscribe({
      next: (response) => this.userRoles = response,
      error: (error) => {
        if (error.status === 404) {
          this.noUserRoles = true;
        }
      }
    });
  }

}
