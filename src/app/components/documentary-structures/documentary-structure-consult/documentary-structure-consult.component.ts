import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Subscription } from 'rxjs';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { ActivatedRoute } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Establishments } from 'src/app/models/establishments.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { UserRolesService } from 'src/app/services/user-roles.service';
import { RolesEnum } from 'src/app/common/roles-enum.enum';
import { SurveyReplyButtonComponent } from '../../surveys/survey-reply-button/survey-reply-button.component';

@Component({
  selector: 'app-documentary-structure-consult',
  templateUrl: './documentary-structure-consult.component.html',
  styleUrls: ['./documentary-structure-consult.component.scss']
})
export class DocumentaryStructureConsultComponent implements OnInit, OnDestroy {

  @ViewChild('surveyReplyButton') surveyReplyButton: SurveyReplyButtonComponent;

  docStruct: DocumentaryStructures;
  establishment: Establishments;

  canEdit = false;

  private docStructId: number;
  private docStructSub: Subscription;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    private activatedRoute: ActivatedRoute,
    private esgbuService: ESGBUService,
    private establishmentsService: EstablishmentsService,
    private userRolesService: UserRolesService,
    private rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.docStructId = +this.activatedRoute.snapshot.params.id;
    this.initCanEdit();
    this.docStructSub = this.docStructsService.getDocStruct(this.docStructId).subscribe({
      next: (response) => {
        this.docStruct = new DocumentaryStructures(response);
        this.esgbuService.setTitle(this.docStruct.useName);
        this.initEstablishment(this.docStruct.establishmentId);
      }
    });
  }

  ngOnDestroy() {
    this.docStructSub.unsubscribe();
    this.esgbuService.clearTitle();
  }

  private initCanEdit() {
    const canAccessRoute = !this.rightsChecker.disabled('/documentary-structures/update/:id');

    if (canAccessRoute) {
      const userRoles = this.userRolesService.getCurrentUserRole();
      for (const userRole of userRoles) {
        if (userRole.role.name === RolesEnum.ADMIN
          || (userRole.role.associated && userRole.documentaryStructure.id === this.docStructId)) {
          this.canEdit = true;
          return;
        }
      }
    }

  }

  private initEstablishment(establishmentId: number) {
    this.establishmentsService.getEstablishment(establishmentId).subscribe({
      next: (response) => this.establishment = response
    });
  }

  updateEstablishmentFromHistory(establishment: Establishments) {
    this.establishment = establishment;
  }

}
