import { Component, Input, ViewEncapsulation, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { DataValuesService } from 'src/app/services/data-values.service';
import { Surveys } from 'src/app/models/surveys.model';
import { SurveysService } from 'src/app/services/surveys.service';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { RolesEnum } from 'src/app/common/roles-enum.enum';
import { SurveyValidationsService } from 'src/app/services/survey-validations.service';
import { SurveyValidations } from 'src/app/models/survey-validations.model';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-survey-consult-current-doc-struct',
  templateUrl: './survey-consult-current-doc-struct.component.html',
  styleUrls: ['./survey-consult-current-doc-struct.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SurveyConsultCurrentDocStructComponent implements OnChanges {

  @Input() survey: Surveys;
  @Input() establishmentId: number;
  @Input() loadDocStruct = true;
  @Input() DiCoDocMode = false;

  docStructList: DocumentaryStructures[];
  physicLibList = {};
  validationList = {};

  validationListInit = false;
  loaded = false;
  canValidate: boolean;
  locale: string;
  errorMessage: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private docStructService: DocumentaryStructuresService,
    private physicLibService: PhysicalLibrariesService,
    private dataValuesService: DataValuesService,
    private surveysService: SurveysService,
    private rightsChecker: RightsCheckerService,
    private surveyValidationsService: SurveyValidationsService,
    private translate: TranslateService,
  ) { }

  ngOnChanges() {
    if (this.loadDocStruct && !this.loaded) {
      this.loaded = true;
      this.locale = this.translate.getDefaultLang();
      this.canValidate = this.rightsChecker.hasRole([RolesEnum.ADMIN, RolesEnum.VALID_SURVEY_RESP]);
      if (this.establishmentId == null) {
        this.establishmentId = this.activatedRoute.snapshot.params.id;
      }
      if (this.establishmentId != null) {
        this.initDocStructByEstablishment();
        this.initSurveyValidationByEstablishment();
      } else {
        this.initDocStructForUser();
      }
      if (this.survey == null) {
        this.initCurrentSurvey();
      }
    }
  }

  private initDocStructForUser() {
    this.docStructService.getAllDocStruct(true, true, true).subscribe({
      next: (response) => {
        this.docStructList = response;
        this.initSurveyValidationForDocStruct();
      },
      error: () => this.setErrorMessage()
    });
  }

  private initDocStructByEstablishment() {
    this.docStructService.getAllByEstablishmentId(this.establishmentId, true, true).subscribe({
      next: (response) => this.docStructList = response,
      error: () => this.setErrorMessage()
    });
  }

  private initSurveyValidationByEstablishment() {
    if (this.survey && this.establishmentId != null) {
      this.getAllSurveyValidation(null, this.establishmentId);
    }
  }

  private initSurveyValidationForDocStruct() {
    let docStructIdList = '';
    for (const docStruct of this.docStructList) {
      docStructIdList += docStruct.id + ',';
    }
    this.getAllSurveyValidation(docStructIdList);
  }

  private getAllSurveyValidation(docStructIdList: string = null, establishmentId: number = null) {
    this.surveyValidationsService.getAllSurveyValidation(this.survey.id, establishmentId, docStructIdList).subscribe({
      next: (response) => this.initValidationList(response),
      error: (error) => {
        if (error.status === 404) { this.validationListInit = true; }
      },
      complete: () => this.validationListInit = true
    });
  }

  private initValidationList(validations: SurveyValidations[]) {
    for (const validation of validations) {
      this.validationList[validation.docStructId] = validation;
    }
  }

  private initCurrentSurvey() {
    this.surveysService.getAllOpenSurvey().subscribe({
      next: (response) => {
        if (response.length > 0) {
          this.survey = response[0];
          this.initSurveyValidationByEstablishment();
        }
      }
    });
  }

  private setErrorMessage() {
    this.translate.stream('error.noDocStructProgress').subscribe({
      next: (value) => this.errorMessage = value
    });
  }

  onClickDocStruct(docStruct: DocumentaryStructures) {
    const docStructId = docStruct.id;
    if (this.physicLibList[docStructId] == null) {
      this.physicLibService.getAllByDocStructId(docStruct.id, true).subscribe({
        next: (response) => this.physicLibList[docStructId] = response.filter(physicLib => physicLib.active),
        error: () => this.physicLibList[docStructId] = []
      });
    }
  }

  onClickReplyButtonDocStruct(docStruct: DocumentaryStructures) {
    this.dataValuesService.setAdministration(new DocumentaryStructures(docStruct));
    this.dataValuesService.setSurvey(this.survey);
  }

  onClickReplyButtonPhysicLib(physicLib: PhysicalLibraries) {
    this.dataValuesService.setAdministration(new PhysicalLibraries(physicLib));
    this.dataValuesService.setSurvey(this.survey);
  }

  onClickValid(valid: boolean, docStruct: DocumentaryStructures) {
    this.surveyValidationsService.validSurveyForDocStruct(valid, this.survey.id, docStruct.id).subscribe({
      next: (response) => this.validationList[docStruct.id] = response
    });
  }
}
