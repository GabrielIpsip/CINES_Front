import { FormGroup, FormControl } from '@angular/forms';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { FieldTypeEnum } from 'src/app/common/broadcast/field-type-enum';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { BroadcastDataType } from 'src/app/models/broadcast/broadcast-data-type.model';
import { DataTypes } from 'src/app/models/data-types.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

export abstract class CommonDataSelector {

  static readonly SIMPLE_KEY = '-simplified-facet-';

  dataTypeBool = new Map<string, DataTypes>();
  dataTypeText = new Map<string, DataTypes>();
  dataTypeNumber = new Map<string, DataTypes>();

  simpleDataTypeBool = new Map<string, DataTypes>();
  simpleDataTypeText = new Map<string, DataTypes>();
  simpleDataTypeNumber = new Map<string, DataTypes>();

  dataTypeSearchFields: FormGroup = new FormGroup({
    dataTypeBoolForm: new FormControl(),
    dataTypeTextForm: new FormControl(),
    dataTypeNumberForm: new FormControl()
  });

  protected constructor(
    private searchFields: FormGroup,
    private administrationName: AdministrationTypesEnum,
    private dataSelectorService: DataSelectorService,
    private administrationPath?: string,
  ) {
    this.dataTypeSearchFields.valueChanges.subscribe({
      next: (values) => {
        this.dataTypeSearchFieldsHasChanged(values);
      }
    });
  }

  abstract onChangeNameForm(query: any, name: string, exact: boolean): void;
  abstract onChangeAddressForm(query: any, address: string): void;
  abstract onChangePostalCodeForm(query: any, postalCode: string): void;
  abstract onChangeDepartmentForm(query: any, department: string[]): void;
  abstract onChangeRegionForm(query: any, region: string[]): void;

  saveAllDataTypeFormValues() {
    const forms = Object.entries(this.dataTypeSearchFields.controls);
    const formValues: [string, any][] = [];
    for (const form of forms) {
      formValues.push([form[0], form[1].value]);
    }
    this.dataSelectorService.saveDataSelectorDataTypeFormValues(this.administrationName, formValues);
  }

  restoreAllDataTypeFormValues() {
    const savedFormValues = this.dataSelectorService.getSavedDataSelectorDataTypeFormValues(this.administrationName);
    const currentFormNames = Object.keys(this.dataTypeSearchFields.controls);
    for (const savedFormValue of savedFormValues) {
      if (savedFormValue[1] == null) {
        continue;
      }

      const savedName = savedFormValue[0];
      const savedValue = savedFormValue[1];
      if (currentFormNames.includes(savedName)) {
        this.dataTypeSearchFields.controls[savedName].setValue(savedValue);
      }
    }
  }

  cleanDataTypeForm() {
    this.dataTypeSearchFields.controls.dataTypeBoolForm.setValue(null);
    this.dataTypeSearchFields.controls.dataTypeTextForm.setValue(null);
    this.dataTypeSearchFields.controls.dataTypeNumberForm.setValue(null);
  }

  getTypeOfField(fieldName: string): FieldTypeEnum {
    const fieldNameSplitted = fieldName.split('-');
    if (fieldNameSplitted.length === 3) {
      return FieldTypeEnum[fieldNameSplitted[1]];
    }
    return null;
  }

  getDataTypeCodeOfField(fieldName: string): string {
    const fieldNameSplitted = fieldName.split('-');
    if (fieldNameSplitted.length === 3) {
      return fieldNameSplitted[2];
    }
    return null;
  }

  getDataTypeOfField(fieldName: string): DataTypes {
    const fieldNameSplitted = fieldName.split('-');
    if (fieldNameSplitted.length === 3) {
      const type = fieldNameSplitted[1];
      const code = fieldNameSplitted[2];

      switch (type) {
        case FieldTypeEnum.bool:
          return this.dataTypeBool.get(code);
        case FieldTypeEnum.text:
          return this.dataTypeText.get(code);
        case FieldTypeEnum.number:
          return this.dataTypeNumber.get(code);
      }
    }
    return null;
  }


  getAdministrationType(): AdministrationTypesEnum {
    return this.administrationName;
  }

  onChangeDataTypeValue(query: any, values: any) {
    for (const code of this.dataTypeBool.keys()) {
      const fieldName = this.getDataTypeFormName(code, FieldTypeEnum.bool);
      const value: boolean = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      this.onChangeBoolDataTypeValue(query, dataTypeNameWithPath, value);
    }

    for (const code of this.dataTypeText.keys()) {
      const fieldName = this.getDataTypeFormName(code, FieldTypeEnum.text);
      const value: string = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      this.onChangeTextDataTypeValue(query, dataTypeNameWithPath, value);
    }

    for (const code of this.dataTypeNumber.keys()) {
      const fieldName = this.getDataTypeFormName(code, FieldTypeEnum.number);
      const value: string[] = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      this.onChangeNumberDataTypeValue(query, dataTypeNameWithPath, value);
    }
  }

  onChangeSimpleDataTypeValue(query: any, values: any) {
    const bool = { bool: { should: [] } };

    if (this.simpleDataTypeBool.size > 0) {
      query.bool.must.push(bool);
    }

    for (const code of this.simpleDataTypeBool.keys()) {
      const fieldName = this.getSimpleDataTypeFormName(code, FieldTypeEnum.bool);
      const value: boolean = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      this.onChangeBoolSimpleDataTypeValue(bool.bool.should, dataTypeNameWithPath, value);
    }

    for (const code of this.simpleDataTypeText.keys()) {
      const fieldName = this.getSimpleDataTypeFormName(code, FieldTypeEnum.text);
      const value: string = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      if (value != null && value.length > 0) {
        this.onChangeTextDataTypeValue(query, dataTypeNameWithPath, value);
      }
    }

    for (const code of this.simpleDataTypeNumber.keys()) {
      const fieldName = this.getSimpleDataTypeFormName(code, FieldTypeEnum.number);
      const value: string[] = values[fieldName];
      const dataTypeNameWithPath = this.getDataTypeNameWithPath(code);
      if (value != null && value.length > 0) {
        this.onChangeNumberDataTypeValue(query, dataTypeNameWithPath, value);
      }
    }
  }

  getSimpleDataTypeFormName(code: string, fieldType: FieldTypeEnum): string {
    return code + CommonDataSelector.SIMPLE_KEY + fieldType + '-' + this.getAdministrationType();
  }

  getDataTypeFormName(code: string, fieldType: FieldTypeEnum): string {
    return this.administrationName + '-' + fieldType + '-' + code;
  }

  private onChangeNumberDataTypeValue(query: any, dataTypeName: string, values: string[]) {
    if (values == null || values.length === 0) {
      return;
    }

    const should = [];

    for (const value of values) {
      const valueSplit = value.split('|');
      if (valueSplit.length !== 2) {
        continue;
      }

      const min: number = Number.parseFloat(valueSplit[0]);
      const max: number = Number.parseFloat(valueSplit[1]);

      const range = {
        range: {
          [dataTypeName]: {
            gte: min,
            lte: max
          }
        }
      };
      should.push(range);
    }

    const bool = { bool: { should } };

    query.bool.must.push(bool);
  }

  private onChangeBoolDataTypeValue(query: any, dataTypeName: string, value: boolean) {
    if (value == null) {
      return;
    }

    const term = {
      term: {
        [dataTypeName]: {
          value
        }
      }
    };

    query.bool.must.push(term);
  }

  private onChangeBoolSimpleDataTypeValue(should: any, dataTypeName: string, value: boolean) {
    if (value == null || value === false) {
      return;
    }

    const term = {
      term: {
        [dataTypeName]: {
          value
        }
      }
    };

    should.push(term);
  }

  private onChangeTextDataTypeValue(query: any, dataTypeName: string, value: string | string[]) {
    if (value == null || value.length === 0) {
      return;
    }

    if (Array.isArray(value)) {

      value = value.map((el: string) => el.trim());

      query.bool.must.push({
        terms: {
          [dataTypeName]: value
        }
      });

    } else {
      value = value.trim();

      const bool = { bool: { should: [] } };

      bool.bool.should.push({
        match: {
          [dataTypeName]: value
        }
      });

      bool.bool.should.push({
        wildcard: {
          [dataTypeName]: {
            value: '*' + value + '*'
          }
        }
      });

      query.bool.must.push(bool);

    }

  }

  private getDataTypeNameWithPath(dataTypeName: string): string {
    if (this.administrationName !== AdministrationTypesEnum.ESTABLISHMENT) {
      dataTypeName = this.administrationPath + '.' + dataTypeName;
    }
    return dataTypeName;
  }

  public getNestedMustQuery(): any {
    return {
      nested: {
        path: this.administrationPath,
        query: {
          bool: {
            must: []
          }
        }
      }
    };
  }

  private dataTypeSearchFieldsHasChanged(values: any) {
    const boolValues: string[] = values.dataTypeBoolForm;
    const textValues: string[] = values.dataTypeTextForm;
    const numberValues: string[] = values.dataTypeNumberForm;

    const newFields: string[] = [];

    if (boolValues != null && boolValues.length > 0) {
      for (const dataTypeName of boolValues) {
        newFields.push(this.buildNameField(dataTypeName, FieldTypeEnum.bool));
      }
    }

    if (textValues != null && textValues.length > 0) {
      for (const dataTypeName of textValues) {
        newFields.push(this.buildNameField(dataTypeName, FieldTypeEnum.text));
      }
    }

    if (numberValues != null && numberValues.length > 0) {
      for (const dataTypeName of numberValues) {
        newFields.push(this.buildNameField(dataTypeName, FieldTypeEnum.number));
      }
    }

    this.cleanOldFields(newFields);
    this.addNewFields(newFields);
  }

  private buildNameField(dataTypeName: string, type: string): string {
    return this.administrationName + '-' + type + '-' + dataTypeName;
  }

  private addNewFields(newFields: string[]) {
    const currentFields = Object.keys(this.searchFields.controls);
    for (const name of newFields) {
      if (!currentFields.includes(name)) {
        const type = this.getTypeOfField(name);
        let initialValue: any = this.dataSelectorService.getSavedDataSelectorDataTypeFormValue(name);
        if (initialValue == null) {
          if (type === FieldTypeEnum.bool) {
            initialValue = true;
          } else {
            initialValue = '';
          }
        }
        this.searchFields.addControl(name, new FormControl(initialValue));
      }
    }
  }

  private cleanOldFields(newFields: string[]) {
    const currentFields = Object.keys(this.searchFields.controls);
    for (const name of currentFields) {
      if (!newFields.includes(name) && name.startsWith(this.administrationName + '-')) {
        this.searchFields.removeControl(name);
      }
    }
  }


  protected addParamIfExactOrNot(multiMatch: any, exact: boolean) {
    const operatorIndex = 'operator';

    if (exact) {
      multiMatch[operatorIndex] = 'and';
    }
    else {
      const fuzinessIndex = 'fuzziness';
      const minShouldMatchIndex = 'minimum_should_match';

      multiMatch[fuzinessIndex] = 'AUTO';
      multiMatch[minShouldMatchIndex] = '100%';
      multiMatch[operatorIndex] = 'or';
    }
  }

  protected checkIfHasDataTypeFieldValue(values: any): boolean {
    const administrationType = this.getAdministrationType();
    for (const value of Object.keys(values)) {
      if (value.startsWith(administrationType)) {
        return true;
      }
    }
    return false;
  }

  protected checkIfHasSimpleDataTypeFieldValue(values: any): boolean {
    for (const [formName, value] of Object.entries(values)) {
      if (formName.indexOf(CommonDataSelector.SIMPLE_KEY) > -1 && formName.endsWith(this.getAdministrationType()) && value != null) {
        if (formName.indexOf('-' + FieldTypeEnum.bool + '-') && value === true) {
          return true;
        } else {
          if ((value as string | string[]).length > 0) {
            return true;
          }
        }
      }
    }
    return false;
  }

  setDataTypes(dataTypes: Map<string, BroadcastDataType>, orderedDataType: DataTypes[]) {
    for (const dataType of orderedDataType) {
      const code = dataType.code;

      if (!dataTypes.has(code)) {
        continue;
      }

      switch (dataType.type.name) {
        case TypesEnum.boolean:
          this.dataTypeBool.set(code, dataType);
          if (dataType.simplifiedFacet) {
            this.simpleDataTypeBool.set(code, dataType);
          }
          break;
        case TypesEnum.text:
          this.dataTypeText.set(code, dataType);
          if (dataType.simplifiedFacet) {
            this.simpleDataTypeText.set(code, dataType);
          }
          break;
        case TypesEnum.number:
        case TypesEnum.operation:
          this.dataTypeNumber.set(code, dataType);
          if (dataType.simplifiedFacet) {
            this.simpleDataTypeNumber.set(code, dataType);
          }
      }
    }
  }
}
