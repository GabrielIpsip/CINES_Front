import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, OnDestroy, Input } from '@angular/core';
import { SurveyDataTypes } from 'src/app/models/survey-data-types.model';
import { ActivatedRoute, Router } from '@angular/router';
import { SurveyDataTypesService } from 'src/app/services/survey-data-types.service';
import { GroupsService } from 'src/app/services/groups.service';
import { DataTypesService } from 'src/app/services/data-types.service';
import { DataTypes } from 'src/app/models/data-types.model';
import { Groups } from 'src/app/models/groups.model';
import { Observable, Subscription, Subject } from 'rxjs';
import { FormGroup } from '@angular/forms';
import { Constraints } from 'src/app/models/constraints.model';
import { DataValuesService } from 'src/app/services/data-values.service';
import { DataValues } from 'src/app/models/data-values.model';
import { trigger, transition, state, style, animate } from '@angular/animations';
import { SurveysService } from 'src/app/services/surveys.service';
import { Surveys } from 'src/app/models/surveys.model';
import { TranslateService } from '@ngx-translate/core';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { LoaderService } from 'src/app/services/loader.service';
import { Administrations } from 'src/app/models/administrations.model';
import { Texts } from 'src/app/models/texts.model';
import { TextsService } from 'src/app/services/texts.service';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';

@Component({
  selector: 'app-survey-reply-data-list',
  templateUrl: './survey-reply-data-list.component.html',
  styleUrls: ['./survey-reply-data-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class SurveyReplyDataListComponent implements OnInit, AfterViewChecked, OnDestroy {

  @Input() missingDataTypesAnswered: number[];

  group: Observable<Groups>;

  columnsToDisplay = ['info', 'code', 'name', 'value', 'measureUnit', 'date', 'oldSurvey1', 'oldSurvey2'];
  expandedElement: DataTypes | null;
  dataTypes: DataTypes[];
  relations: boolean[];
  surveyId: number;
  oldSurvey1: Surveys;
  oldSurvey2: Surveys;
  surveyForm: FormGroup;
  constraints: Constraints[];
  dataValues: string[];
  oldDataValues1: string[];
  oldDataValues2: string[];
  lastGroup: Groups;
  updateOperation = new Subject<void>();
  loaded: boolean;
  administration: Administrations;

  // For doc struct comments
  associatedDocStructId: number[] = [];
  associatedDocStructName: Map<number, string>;

  TypesEnum = TypesEnum;
  private groupSub: Subscription;

  constructor(
    private dataTypesService: DataTypesService,
    private textsService: TextsService,
    private groupsService: GroupsService,
    private surveysService: SurveysService,
    private dataValuesService: DataValuesService,
    private surveyDataTypesService: SurveyDataTypesService,
    private activatedRoute: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private esgbuService: ESGBUService,
    public loaderService: LoaderService,
    private docStructsService: DocumentaryStructuresService
  ) { }

  get defaultLang() {
    return this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.administration = this.dataValuesService.getAdministration();
    this.loaded = false;
    this.initTitle();
    this.lastGroup = new Groups();
    this.surveyId = parseInt(this.activatedRoute.snapshot.params.id, 10);
    this.initBeforeLastSurvey();
    this.initAssociatedDocStructId();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    if (this.groupSub != null) {
      this.groupSub.unsubscribe();
    }
    this.esgbuService.clearTitle();
  }

  initTitle() {
    const administration = this.dataValuesService.getAdministration();
    const survey = this.dataValuesService.getSurvey();
    if (administration != null && survey != null) {
      this.esgbuService.setTitle(this.dataValuesService.getAdministration().useName);
      this.esgbuService.addElementTitle(survey.name);
    }
  }

  onChangeValue(pairIdValue: [number, string]) {
    if (pairIdValue.length === 2) {
      const dataTypeId = pairIdValue[0];
      const value = pairIdValue[1];
      if (value != null) {
        this.dataValuesService.insertValue(this.surveyId, dataTypeId, value).subscribe(response => {
          this.dataValues[response.dataTypeId] = response.value;
          this.updateOperationAfterChange(dataTypeId);
        });
      } else {
        this.dataValuesService.deleteValue(this.surveyId, dataTypeId).subscribe({
          next: () => {
            this.dataValues[dataTypeId] = null;
            this.updateOperationAfterChange(dataTypeId);
          }
        });
      }
    }
  }

  getOldValue(dataTypeId: number): string {
    if (this.oldDataValues1 != null) {
      return this.oldDataValues1[dataTypeId];
    } else {
      return null;
    }
  }

  isLongText(dataType: DataTypes): boolean {
    if (dataType.type == null || dataType.constraint == null) {
      return false;
    }

    const textConstraint = dataType.constraint as Texts;

    return dataType.type.name === TypesEnum.text && textConstraint.maxLength >
      this.textsService.maxLengthShortTextField;
  }

  onKeyDown(event: any) {

    if (event.key !== 'Enter') {
      return;
    }

    const inputId = event.target;
    if (!inputId || event.target.localName === 'textarea') {
      return;
    }

    event.preventDefault();

    const inputList = document.getElementsByClassName('mat-input-element') as unknown as HTMLInputElement[];
    const inputArray = Array.from(inputList);

    let nextIndex = inputArray.indexOf(inputId) + 1;


    if (nextIndex >= inputArray.length) {
      nextIndex = 0;
    }

    let nextElement = inputArray[nextIndex];

    if (nextElement.disabled) {
      nextElement = inputArray[0];
    }

    nextElement.focus();
  }

  private updateOperationAfterChange(dataTypeId: number) {
    let launchUpdate = false;
    for (const dataType of this.dataTypes) {
      if (dataType.id === dataTypeId && dataType.type.name === TypesEnum.number) {
        launchUpdate = true;
        break;
      }
    }

    if (launchUpdate) {
      this.dataValuesService.getAllValue(this.surveyId, this.TypesEnum.operation)
        .subscribe(response => {
          this.fillDataTypeValues(response);
          this.updateOperation.next();
        });
    }
  }

  private initBeforeLastSurvey() {
    this.surveysService.getAllSurvey().subscribe({
      next: (response) => {
        const oldSurveys = this.getBeforeLastSurvey(response);
        if (oldSurveys[0] != null) {
          this.oldSurvey1 = oldSurveys[0];
          if (oldSurveys[1] != null) {
            this.oldSurvey2 = oldSurveys[1];
          }
        }
      },
      complete: () => this.initComponent()
    });
  }

  private getBeforeLastSurvey(surveys: Surveys[]): Surveys[] {
    let i = 0;
    const nbrSurvey = surveys.length;
    const oldSurveys = [];
    for (const survey of surveys) {
      if (survey.id === this.surveyId) {
        if (i < nbrSurvey - 1) {
          oldSurveys.push(surveys[i + 1]);
        } else {
          this.columnsToDisplay.pop();
        }
        if (i < nbrSurvey - 2) {
          oldSurveys.push(surveys[i + 2]);
        } else {
          this.columnsToDisplay.pop();
        }
      }
      i++;
    }
    return oldSurveys;
  }

  private initComponent() {
    this.group = this.groupsService.getSelectedGroup();
    this.initializeArrays();
  }

  private changeGroupEvent() {
    this.groupSub = this.group.subscribe({
      next: (value) => this.onChangeGroup(value)
    });
  }

  private onChangeGroup(group: Groups) {
    const currentAdministration = this.dataValuesService.getAdministration();
    const administrationChange = currentAdministration.id !== this.administration.id ||
      currentAdministration.CLASS_NAME !== this.administration.CLASS_NAME;

    if (administrationChange) {
      this.ngOnDestroy();
      this.ngOnInit();
      return;
    }

    if (this.lastGroup.id !== group.id || administrationChange) {
      this.loaded = false;
      this.dataTypes = [];
      this.surveyForm = new FormGroup({});
      this.lastGroup = group;
      this.dataTypesService.getAllDataTypesByGroup(group.id).subscribe({
        next: (response) => {
          this.fillDataTypes(response);
          this.loaded = true;
        },
        error: () => {
          this.loaded = true;
        }
      });
    }
  }

  private initializeArrays() {
    this.relations = [];
    this.constraints = [];
    this.dataValues = [];
    this.initOldDataValues();
    this.surveyDataTypesService.getAllBySurveyId(this.surveyId).subscribe(
      response => {
        this.fillRelations(response);
        this.changeGroupEvent();
      });
    const dataValuesObs = this.dataValuesService.getAllValue(this.surveyId);
    if (dataValuesObs) {
      dataValuesObs.subscribe({
        next: (response) => this.fillDataTypeValues(response),
        error: (error) => {
          if (error.status === 404) { /* Do nothing */ }
        }
      });
    } else {
      this.router.navigateByUrl('');
    }
  }

  private initOldDataValues() {
    if (this.oldSurvey1 != null) {
      this.oldDataValues1 = [];
      const oldDataValues1Obs = this.dataValuesService.getAllValue(this.oldSurvey1.id);
      if (oldDataValues1Obs != null) {
        oldDataValues1Obs.subscribe({
          next: (response) => this.fillOldDataTypeValues(response, 1),
          error: (error) => {
            if (error.status === 404) { /* Do nothing */ }
          }
        });
      }
    }
    if (this.oldSurvey2 != null) {
      this.oldDataValues2 = [];
      const oldDataValues2Obs = this.dataValuesService.getAllValue(this.oldSurvey2.id);
      if (oldDataValues2Obs != null) {
        oldDataValues2Obs.subscribe({
          next: (response) => this.fillOldDataTypeValues(response, 2),
          error: (error) => {
            if (error.status === 404) { /* Do nothing */ }
          }
        });
      }
    }
  }

  private fillDataTypes(dataTypes: DataTypes[]) {
    for (const dataType of dataTypes) {
      if (this.relations[dataType.id]) {
        this.dataTypes.push(dataType);
      }
    }
  }

  private fillRelations(relations: SurveyDataTypes[]) {
    for (const relation of relations) {
      if (relation.active) {
        this.relations[relation.dataTypeId] = relation.active;
      }
    }
  }

  private fillDataTypeValues(dataValues: DataValues[]) {
    for (const dataValue of dataValues) {
      this.dataValues[dataValue.dataTypeId] = dataValue.value;
    }
  }

  private fillOldDataTypeValues(dataValues: DataValues[], year: number) {
    let oldValueArray: string[];
    switch (year) {
      case 1:
        oldValueArray = this.oldDataValues1;
        break;
      case 2:
        oldValueArray = this.oldDataValues2;
        break;
      default:
        oldValueArray = [];
    }
    if (dataValues != null && oldValueArray != null) {
      for (const dataValue of dataValues) {
        oldValueArray[dataValue.dataTypeId] = dataValue.value;
      }
    }
  }

  /**
   * Initialize associated doc struct id to load just comment in relation with administration which is consulted.
   */
  private initAssociatedDocStructId() {
    this.associatedDocStructId = [];
    this.associatedDocStructName = new Map<number, string>();

    if (this.administration == null) {
      return;
    }

    const docStructId = this.administration.getAssociatedDocStructId();

    if (docStructId === -1) {
      // Establishment case
      this.docStructsService.getAllByEstablishmentId(this.administration.id).subscribe({
        next: (response) => {
          for (const docStruct of response) {
            this.associatedDocStructId.push(docStruct.id);
            this.associatedDocStructName.set(docStruct.id, docStruct.useName);
          }
        }
      });

    } else {
      // Doc struct and physic lib case
      this.associatedDocStructId.push(docStructId);
    }
  }

}
