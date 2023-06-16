import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { FieldTypeEnum } from 'src/app/common/broadcast/field-type-enum';
import { DataTypes } from 'src/app/models/data-types.model';
import { CommonDataSelector } from '../common-data-selector';

@Component({
  selector: 'app-data-selector-data-type',
  templateUrl: './data-selector-data-type.component.html',
  styleUrls: ['./data-selector-data-type.component.scss']
})
export class DataSelectorDataTypeComponent {

  @Input() searchFields: FormGroup;
  @Input() dataSelector: CommonDataSelector;

  fieldTypeEnum = FieldTypeEnum;
  administrationTypeEnum = AdministrationTypesEnum;

  commonDataSelector = CommonDataSelector;

  private dataTypeBool: DataTypes[];
  private dataTypeText: DataTypes[];
  private dataTypeNumber: DataTypes[];

  getDataTypeBool(): DataTypes[] {
    if (this.dataTypeBool != null && this.dataTypeBool.length > 0) {
      return this.dataTypeBool;
    }

    if (this.dataSelector.dataTypeBool != null) {
      this.dataTypeBool = Array.from(this.dataSelector.dataTypeBool.values())
        .filter((el: DataTypes) => el.facet === true);
    } else {
      this.dataTypeBool = [];
    }

    return this.dataTypeBool;
  }

  getDataTypeText(): DataTypes[] {
    if (this.dataTypeText != null && this.dataTypeText.length > 0) {
      return this.dataTypeText;
    }

    if (this.dataSelector.dataTypeText != null) {
      this.dataTypeText = Array.from(this.dataSelector.dataTypeText.values())
        .filter((el: DataTypes) => el.facet === true);
    } else {
      this.dataTypeText = [];
    }

    return this.dataTypeText;
  }

  getDataTypeNumber(): DataTypes[] {
    if (this.dataTypeNumber != null && this.dataTypeNumber.length > 0) {
      return this.dataTypeNumber;
    }

    if (this.dataSelector.dataTypeNumber != null) {
      this.dataTypeNumber = Array.from(this.dataSelector.dataTypeNumber.values())
        .filter((el: DataTypes) => el.facet === true);
    } else {
      this.dataTypeNumber = [];
    }

    return this.dataTypeNumber;
  }

}
