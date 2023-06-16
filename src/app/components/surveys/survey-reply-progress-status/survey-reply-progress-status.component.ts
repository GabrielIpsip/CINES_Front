import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { Administrations } from 'src/app/models/administrations.model';
import { DataTypes } from 'src/app/models/data-types.model';
import { DataValues } from 'src/app/models/data-values.model';
import { Groups } from 'src/app/models/groups.model';
import { SurveyDataTypes } from 'src/app/models/survey-data-types.model';
import { DataTypesService } from 'src/app/services/data-types.service';
import { DataValuesService } from 'src/app/services/data-values.service';
import { GroupsService } from 'src/app/services/groups.service';
import { LoaderService } from 'src/app/services/loader.service';
import { SurveyDataTypesService } from 'src/app/services/survey-data-types.service';

@Component({
  selector: 'app-survey-reply-progress-status',
  templateUrl: './survey-reply-progress-status.component.html',
  styleUrls: ['./survey-reply-progress-status.component.scss']
})
export class SurveyReplyProgressStatusComponent implements OnInit {

  @Output() missingDataValuesEmitter = new EventEmitter<number[]>();
  @Output() missingGroupsEmitter = new EventEmitter<number[]>();
  @Output() missingParentGroupsEmitter = new EventEmitter<number[]>();

  surveyId: number;
  administration: Administrations;
  dataValues: number[];

  surveyDataTypes: SurveyDataTypes[];
  dataTypes = new Map<number, DataTypes>();
  groups = new Map<number, Groups>();

  missingDataValues: number[];
  missingGroups: number[];
  missingParentGroups: number[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private dataValuesService: DataValuesService,
    private dataTypesService: DataTypesService,
    private translate: TranslateService,
    private surveyDataTypesService: SurveyDataTypesService,
    private groupsService: GroupsService,
    private loaderService: LoaderService
  ) { }

  ngOnInit(
  ) {
    this.surveyId = parseInt(this.activatedRoute.snapshot.params.id, 10);
  }

  onClickFindVarButton() {
    this.loaderService.show(true);
    this.administration = this.dataValuesService.getAdministration();

    const promises: any = [
      this.dataValuesService.getAllValue(this.surveyId).toPromise()
    ];

    if (this.surveyDataTypes == null) {
      promises[1] = this.surveyDataTypesService.getAllBySurveyId(this.surveyId).toPromise();
    }

    if (this.dataTypes.size === 0) {
      promises[2] = this.dataTypesService.getAllDataTypesOrdered(this.translate.getDefaultLang(), false).toPromise();
    }

    if (this.groups.size === 0) {
      promises[3] = this.groupsService.getGroupsByAdministrationTypeName(this.administration.TYPE_NAME).toPromise();
    }

    Promise.all(promises).then((response) => {
      const dataValues = response[0] as DataValues[];

      if (this.surveyDataTypes == null) {
        this.surveyDataTypes = response[1] as SurveyDataTypes[];
      }

      if (this.dataTypes.size === 0) {
        this.fillDataTypes(response[2] as DataTypes[]);
      }

      if (this.groups.size === 0) {
        this.fillGroups(response[3] as Groups[]);
      }

      this.fillMissingDataValues(dataValues);
      this.fillMissingGroup();

      this.missingDataValuesEmitter.emit(this.missingDataValues);
      this.missingGroupsEmitter.emit(this.missingGroups);
      this.missingParentGroupsEmitter.emit(this.missingParentGroups);
    }).finally(() => {
      this.loaderService.hide(true);
    });
  }

  private fillMissingDataValues(dataValues: DataValues[]) {
    this.missingDataValues = [];

    for (const surveyDataType of this.surveyDataTypes) {
      if (!surveyDataType.active || !this.hasGoodType(surveyDataType.dataTypeId)) {
        continue;
      }

      const dataValue = dataValues.find((el) => el.dataTypeId === surveyDataType.dataTypeId);
      if (dataValue == null || dataValue.value == null || dataValue.value.length === 0) {
        this.missingDataValues.push(surveyDataType.dataTypeId);
      }
    }
  }

  private fillMissingGroup() {
    this.missingGroups = [];
    this.missingParentGroups = [];
    for (const dataTypeId of this.missingDataValues) {
      const dataType = this.dataTypes.get(dataTypeId);

      if (!this.missingGroups.includes(dataType.groupId)) {
        this.missingGroups.push(dataType.groupId);
        this.addAllParentGroup(dataType.groupId);
      }
    }
  }

  private addAllParentGroup(groupId: number) {
    if (groupId == null) {
      return;
    }

    const group = this.groups.get(groupId);
    if (group.parentGroupId != null && !this.missingParentGroups.includes(group.parentGroupId)) {
      this.missingParentGroups.push(group.parentGroupId);
    }
    this.addAllParentGroup(group.parentGroupId);
  }

  private fillDataTypes(dataTypes: DataTypes[]) {
    for (const dataType of dataTypes) {
      this.dataTypes.set(dataType.id, dataType);
    }
  }

  private fillGroups(groups: Groups[]) {
    for (const group of groups) {
      this.groups.set(group.id, group);
    }
  }
  private hasGoodType(dataTypeId: number): boolean {
    const dataType = this.dataTypes.get(dataTypeId);

    if (dataType.type.name === TypesEnum.operation) {
      return false;
    }

    const group = this.groups.get(dataType.groupId);

    if (group == null) {
      return false;
    }

    return this.administration.TYPE_NAME === group.administrationType.name;
  }

}
