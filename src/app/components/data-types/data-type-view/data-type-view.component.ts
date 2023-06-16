import { Component, OnInit, Input, ChangeDetectorRef, AfterViewChecked, ViewChild } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { Types } from 'src/app/models/types.model';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TypesService } from 'src/app/services/types.service';
import { TranslateService } from '@ngx-translate/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { DataTypesService, BodyDataTypes } from 'src/app/services/data-types.service';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { Constraints } from 'src/app/models/constraints.model';
import { DataTypeConstraintView } from 'src/app/common/data-type-constraint-view.interface';
import { Lang } from 'src/app/common/lang.interface';
import { Translation } from 'src/app/common/translation.interface';
import { Groups } from 'src/app/models/groups.model';
import { GroupsService } from 'src/app/services/groups.service';
import { AdministrationTypes } from 'src/app/models/administration-types.model';
import { GroupNode } from 'src/app/common/group-node';

@Component({
  selector: 'app-data-type-view',
  templateUrl: './data-type-view.component.html',
  styleUrls: ['./data-type-view.component.scss']
})
export class DataTypeViewComponent implements OnInit, AfterViewChecked {

  @Input() dataType: DataTypes;
  @Input() administrationType: AdministrationTypes;
  @Input() nodes: GroupNode[];
  @Input() groupList: Groups[];

  @ViewChild('constraintForm') constraintForm: DataTypeConstraintView;

  allAdministrationTypeGroup: GroupNode[];

  langs: Lang[];
  tabLang: Lang[] = [];

  dataTypeNames = new Map<string, string>();
  dataTypeInstructions = new Map<string, string>();
  dataTypeDefinitions = new Map<string, string>();
  dataTypeMeasureUnit = new Map<string, string>();
  dataTypeDate = new Map<string, string>();

  private readonly groupFormName = 'groupForm';

  dataTypeTranslatableField = new Map<string, Map<string, string>>([
    ['names', this.dataTypeNames],
    ['instructions', this.dataTypeInstructions],
    ['definitions', this.dataTypeDefinitions],
    ['measureUnits', this.dataTypeMeasureUnit],
    ['dates', this.dataTypeDate]
  ]);

  currentName: string;
  currentInstruction: string;
  currentDefinition: string;
  currentMeasureUnit: string;
  currentDate: string;

  allTypes: Types[];
  TypeEnum = TypesEnum;

  selectedTabIndex: number;

  init = false;

  dataTypeForm = new FormGroup({
    codeForm: new FormControl('', [Validators.maxLength(20), Validators.required, Validators.pattern(/^[A-Z0-9_]+$/i)]),
    codeEUForm: new FormControl('', [Validators.maxLength(20), Validators.pattern(/^[A-Z0-9_]+$/i)]),
    groupOrderForm: new FormControl('', [Validators.required, Validators.min(1)]),
    administratorForm: new FormControl('', [Validators.required]),
    privateForm: new FormControl('', [Validators.required]),
    facetForm: new FormControl('', [Validators.required]),
    simplifiedFacetForm: new FormControl('', [Validators.required]),
    typeForm: new FormControl('', [Validators.required])
  });

  constructor(
    public esgbuService: ESGBUService,
    private typesService: TypesService,
    private translate: TranslateService,
    private dataTypesService: DataTypesService,
    private cdRef: ChangeDetectorRef,
    public groupsService: GroupsService
  ) { }

  get f() {
    return this.dataTypeForm.controls;
  }

  ngOnInit() {
    this.allAdministrationTypeGroup = this.groupList
      .filter((el: Groups) => el.administrationType.id === this.administrationType.id);

    if (this.dataType == null) {
      this.dataType = new DataTypes();
    } else {
      this.dataTypeForm.addControl(this.groupFormName, new FormControl('', [Validators.required]));
    }

    this.langs = this.esgbuService.AVAILABLE_LANG;

    this.typesService.getAllTypes().subscribe({
      next: (response) => this.allTypes = response
    });

    for (const [field] of this.dataTypeTranslatableField) {
      for (const lang of this.langs) {
        const validators = [Validators.maxLength(65535)];
        if (field === 'names' && lang.language === this.esgbuService.DEFAULT_LANG) {
          validators.push(Validators.required);
        }
        const formControl = new FormControl('', validators);
        this.dataTypeForm.addControl(field + '_' + lang.language, formControl);
      }
    }
  }

  ngAfterViewChecked() {
    if (!this.init) {
      this.loadTranslatedField(this.tabLang[0]);
      this.loadOtherDataTypeInfo();
      this.focusCurrentLangTab();
      this.changeDisableValueFacetCheckBox();
      this.init = true;
    }
    this.cdRef.detectChanges();
  }

  getTabLabel(index: number, lang: Lang) {
    this.tabLang[index] = lang;
    return 'app.langName.' + lang.language;
  }

  onChangeTab(event: MatTabChangeEvent) {
    const lang: Lang = this.tabLang[event.index];
    this.loadTranslatedField(lang);
  }

  compareType(t1: Types, t2: Types): boolean {
    t1 = new Types(t1);
    t2 = new Types(t2);
    return t1.equals(t2);
  }

  getNewValues(): BodyDataTypes {
    const dataType = {} as BodyDataTypes;
    dataType.code = this.f.codeForm.value;
    dataType.codeEu = this.f.codeEUForm.value;
    dataType.groupOrder = this.f.groupOrderForm.value;
    dataType.administrator = this.f.administratorForm.value;
    dataType.private = this.f.privateForm.value;
    dataType.facet = this.f.facetForm.value;
    dataType.simplifiedFacet = this.f.simplifiedFacetForm.value;
    dataType.typeId = this.f.typeForm.value.id;

    if (this.dataTypeForm.contains(this.groupFormName)) {
      dataType.groupId = this.f.groupForm.value;
    }

    const controlNames = Object.keys(this.f);

    for (const [field] of this.dataTypeTranslatableField) {
      const translations: Translation[] = [];

      for (const controlName of controlNames) {
        if (!this.esgbuService.AVAILABLE_LANG.find((el) => field + '_' + el.language === controlName)) {
          continue;
        }
        const control = this.dataTypeForm.get(controlName);
        const langName = controlName.split('_')[1];
        const oldValue = this.dataTypeTranslatableField.has(field)
          ? this.dataTypeTranslatableField.get(field)[langName]
          : null;

        if ((oldValue != null && control.value !== oldValue) || control.value?.length > 0) {
          const translation = { lang: langName, value: control.value };
          translations.push(translation);
        }
      }

      dataType[field] = translations;
    }

    return dataType;
  }

  getConstraintNewValues(): Constraints {
    if (this.constraintForm == null) {
      return null;
    }

    return this.constraintForm.getNewValues();
  }

  isValid(): boolean {
    let valid = this.dataTypeForm.valid;
    if (this.constraintForm != null && this.constraintForm.constraintForm != null) {
      valid = valid && this.constraintForm.constraintForm.valid;
    }
    return valid;
  }

  changeDisableValueFacetCheckBox() {
    if (this.f.privateForm.value) {
      this.f.facetForm.disable();
      this.f.simplifiedFacetForm.disable();
    } else {
      this.f.facetForm.enable();
      this.f.simplifiedFacetForm.enable();
    }
  }

  private loadTranslatedField(lang: Lang) {
    if (this.dataType.id == null) {
      return;
    }

    const existName = this.dataTypeNames[lang.language];
    const existInstruction = this.dataTypeInstructions[lang.language];
    const existDefinition = this.dataTypeDefinitions[lang.language];
    const existMeasureUnit = this.dataTypeMeasureUnit[lang.language];
    const existDate = this.dataTypeDate[lang.language];

    if (existName != null || existInstruction != null || existDefinition != null || existMeasureUnit != null
      || existDate != null) {
      this.currentName = existName;
      this.currentInstruction = existInstruction;
      this.currentDefinition = existDefinition;
      this.currentMeasureUnit = existMeasureUnit;
      this.currentDate = existDate;
      return;
    }

    if (this.translate.getDefaultLang() === lang.language) {
      this.initParameterAfterLoad(this.dataType, lang);
    } else {
      this.dataTypesService.getDataType(this.dataType.id, lang.language).subscribe({
        next: (response) => {
          this.initParameterAfterLoad(response, lang);
        },
        error: (error) => {
          if (error.status === 404) {
            this.initParameterAfterLoad(null, lang);
          }
        }
      });
    }
  }

  private initParameterAfterLoad(dataType: DataTypes, lang: Lang) {
    if (dataType != null) {
      this.currentName = dataType.name;
      this.currentInstruction = dataType.instruction;
      this.currentDefinition = dataType.definition;
      this.currentMeasureUnit = dataType.measureUnit;
      this.currentDate = dataType.date;
    }

    this.dataTypeNames[lang.language] = this.currentName;
    this.dataTypeInstructions[lang.language] = this.currentInstruction;
    this.dataTypeDefinitions[lang.language] = this.currentDefinition;
    this.dataTypeMeasureUnit[lang.language] = this.currentMeasureUnit;
    this.dataTypeDate[lang.language] = this.currentDate;

    if (this.currentName != null) {
      this.dataTypeForm.get('names_' + lang.language).setValue(this.currentName);
    }

    if (this.currentInstruction != null) {
      this.dataTypeForm.get('instructions_' + lang.language).setValue(this.currentInstruction);
    }

    if (this.currentDefinition != null) {
      this.dataTypeForm.get('definitions_' + lang.language).setValue(this.currentDefinition);
    }

    if (this.currentDefinition != null) {
      this.dataTypeForm.get('measureUnits_' + lang.language).setValue(this.currentMeasureUnit);
    }

    if (this.currentDate != null) {
      this.dataTypeForm.get('dates_' + lang.language).setValue(this.currentDate);
    }
  }

  private loadOtherDataTypeInfo() {

    if (this.dataType.id == null) {
      this.f.administratorForm.setValue(false);
      this.f.privateForm.setValue(false);
      this.f.facetForm.setValue(false);
      this.f.simplifiedFacetForm.setValue(false);
      return;
    }

    this.f.codeForm.setValue(this.dataType.code);
    this.f.codeEUForm.setValue(this.dataType.codeEu);
    this.f.groupOrderForm.setValue(this.dataType.groupOrder);
    this.f.administratorForm.setValue(this.dataType.administrator);
    this.f.privateForm.setValue(this.dataType.private);
    this.f.facetForm.setValue(this.dataType.facet);
    this.f.simplifiedFacetForm.setValue(this.dataType.simplifiedFacet);
    this.f.typeForm.setValue(this.dataType.type);

    if (this.dataTypeForm.contains(this.groupFormName)) {
      this.f.groupForm.setValue(this.dataType.groupId);
    }
  }

  private focusCurrentLangTab() {
    for (const [index, lang] of this.tabLang.entries()) {
      if (lang.language === this.translate.getDefaultLang()) {
        this.selectedTabIndex = index;
      }
    }
  }

}
