import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { Groups } from 'src/app/models/groups.model';
import { Numbers } from 'src/app/models/numbers.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { GroupsService } from 'src/app/services/groups.service';
import { DataSelectorTypesTreeComponent, DataTypeFlatNode, DataTypeNode } from '../data-selector-types-tree/data-selector-types-tree.component';

@Component({
  selector: 'app-data-selector-types',
  templateUrl: './data-selector-types.component.html',
  styleUrls: ['./data-selector-types.component.scss']
})
export class DataSelectorTypesComponent implements OnInit, OnDestroy {

  @ViewChild('establishmentTree') establishmentTree: DataSelectorTypesTreeComponent;
  @ViewChild('docStructTree') docStructTree: DataSelectorTypesTreeComponent;
  @ViewChild('physicLibTree') physicLibTree: DataSelectorTypesTreeComponent;

  establishmentsData: DataTypeNode[];
  docStructsData: DataTypeNode[];
  physicLibsData: DataTypeNode[];

  alreadySelectedEstablishmentNode: DataTypeFlatNode[] = [];
  alreadySelectedDocStructNode: DataTypeFlatNode[] = [];
  alreadySelectedPhysicLibNode: DataTypeFlatNode[] = [];

  hasEstablishment = false;
  hasDocStruct = false;
  hasPhysicLib = false;

  administrationTypeEnum = AdministrationTypesEnum;

  constructor(
    private groupsService: GroupsService,
    private dataSelectorService: DataSelectorService,
    private snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private esgbuService: ESGBUService
  ) { }

  ngOnInit() {

    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.ESTABLISHMENT).then((value) => {
      this.hasEstablishment = value?.length > 0;

      if (this.hasEstablishment) {
        this.alreadySelectedEstablishmentNode =
          this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.ESTABLISHMENT);
      }
    });

    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.DOC_STRUCT).then((value) => {
      this.hasDocStruct = value?.length > 0;

      if (this.hasDocStruct) {
        this.alreadySelectedDocStructNode =
          this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.DOC_STRUCT);
      }
    });

    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.PHYSIC_LIB).then((value) => {
      this.hasPhysicLib = value?.length > 0;

      if (this.hasPhysicLib) {
        this.alreadySelectedPhysicLibNode =
          this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.PHYSIC_LIB);
      }
    });

    this.esgbuService.setTitle('broadcast.dataSelectorTypeTitle', true);

    this.groupsService.getAllGroups(true).subscribe({
      next: (response) => {
        this.establishmentsData = this.buildTreeFromArray(response, AdministrationTypesEnum.ESTABLISHMENT);
        this.docStructsData = this.buildTreeFromArray(response, AdministrationTypesEnum.DOC_STRUCT);
        this.physicLibsData = this.buildTreeFromArray(response, AdministrationTypesEnum.PHYSIC_LIB);
      }
    });
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  private buildTreeFromArray(groups: Groups[], administrationType: AdministrationTypesEnum): DataTypeNode[] {
    const nodes = [];
    const roots: DataTypeNode[] = [];

    for (const group of groups) {

      if (group.administrationType.name !== administrationType) {
        continue;
      }

      const node: DataTypeNode = {
        id: group.id,
        name: group.title,
        children: [],
        code: null,
        type: null,
        measureUnit: null,
        decimal: null
      };

      const children = nodes[group.id]?.children;
      if (children != null) {
        node.children = children;
      }

      nodes[group.id] = node;


      const parentId = group.parentGroupId;
      if (!parentId) {
        roots.push(node);
        continue;
      }

      let parentNode = nodes[parentId];
      if (!parentNode) {
        parentNode = {
          id: parentId,
          name: '',
          children: [],
          code: null,
          type: null,
          decimal: null
        };
        nodes[parentId] = parentNode;
      }
      parentNode.children.push(node);
    }

    this.addDataTypeToTree(nodes, administrationType);
    console.log(nodes);
    return roots;
  }

  private addDataTypeToTree(groupTree: DataTypeNode[], administrationType: AdministrationTypesEnum) {
    const dataTypes = this.dataSelectorService.getStoredDataSelectorDataTypes(administrationType);
    const dataTypeConcat = dataTypes.boolean.concat(dataTypes.number.concat(dataTypes.text));

    for (const dataTypeInfo of dataTypeConcat) {
      const dataType = dataTypeInfo[1];
      const constraint = dataType.constraint as Numbers;

      const node: DataTypeNode = {
        id: dataType.id,
        name: dataType.name,
        measureUnit: dataType.measureUnit,
        code: dataType.code,
        children: null,
        type: TypesEnum[dataType.type.name],
        decimal: constraint?.isDecimal
      };

      let index = dataType.groupOrder;
      while (groupTree[dataType.groupId].children[index] != null) {
        index++;
      }
      groupTree[dataType.groupId].children[index] = node;
    }
  }

  onClickUseSelectionButton() {
    const establishmentType = this.establishmentTree?.getSelection();
    const docStructType = this.docStructTree?.getSelection();
    const physicLibType = this.physicLibTree?.getSelection();

    if ((establishmentType == null || establishmentType.length === 0)
      && (docStructType == null || docStructType.length === 0)
      && (physicLibType == null || physicLibType.length === 0)) {
      this.translate.stream('error.selectAtLastOnType').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
      return;
    }

    this.dataSelectorService.setStoredSelectedType(AdministrationTypesEnum.ESTABLISHMENT, establishmentType);
    this.dataSelectorService.setStoredSelectedType(AdministrationTypesEnum.DOC_STRUCT, docStructType);
    this.dataSelectorService.setStoredSelectedType(AdministrationTypesEnum.PHYSIC_LIB, physicLibType);

    this.router.navigateByUrl('broadcast/data-selector-visualize');
  }

}
