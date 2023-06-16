import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { Subscription } from 'rxjs';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { ActivatedRoute } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { RolesEnum } from 'src/app/common/roles-enum.enum';
import { SurveyReplyButtonComponent } from '../../surveys/survey-reply-button/survey-reply-button.component';

@Component({
  selector: 'app-physical-library-consult',
  templateUrl: './physical-library-consult.component.html',
  styleUrls: ['./physical-library-consult.component.scss'],
})
export class PhysicalLibraryConsultComponent implements OnInit, OnDestroy {

  @ViewChild('surveyReplyButton') surveyReplyButton: SurveyReplyButtonComponent;

  physicLib: PhysicalLibraries;
  docStruct: DocumentaryStructures;

  canEdit = false;

  private physicLibSub: Subscription;
  private physicLibId: number;

  constructor(
    private physicLibService: PhysicalLibrariesService,
    private docStructsService: DocumentaryStructuresService,
    private activatedRoute: ActivatedRoute,
    private esgbuService: ESGBUService,
    private rightsChecker: RightsCheckerService,
    private userRolesService: UserRolesService
  ) { }

  ngOnInit() {
    this.physicLibId = this.activatedRoute.snapshot.params.id;
    this.physicLibSub = this.physicLibService.getPhysicLib(this.physicLibId).subscribe({
      next: (response) => {
        this.physicLib = new PhysicalLibraries(response);
        this.esgbuService.setTitle(this.physicLib.useName);
        this.initDocStruct(this.physicLib.docStructId);
        this.initCanEdit();
      }
    });
  }

  ngOnDestroy() {
    this.physicLibSub.unsubscribe();
    this.esgbuService.clearTitle();
  }

  private initCanEdit() {
    const canAccessRoute = !this.rightsChecker.disabled('/physical-libraries/update/:id');

    if (canAccessRoute) {
      const userRoles = this.userRolesService.getCurrentUserRole();
      for (const userRole of userRoles) {
        if (userRole.role.name === RolesEnum.ADMIN
          || (userRole.role.associated && userRole.documentaryStructure.id === this.physicLib.docStructId
          )) {
          this.canEdit = true;
          return;
        }
      }
    }
  }

  private initDocStruct(docStructId: number) {
    this.docStructsService.getDocStruct(docStructId).subscribe({
      next: (response) => this.docStruct = response
    });
  }

  updateDocStructFromHistory(docStruct: DocumentaryStructures) {
    this.docStruct = docStruct;
  }

}
