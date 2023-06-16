import { Component, DoCheck, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { FieldTypeEnum } from 'src/app/common/broadcast/field-type-enum';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { CommonDataSelector } from '../common-data-selector';

@Component({
  selector: 'app-data-selector-simple-data-type',
  templateUrl: './data-selector-simple-data-type.component.html',
  styleUrls: ['./data-selector-simple-data-type.component.scss']
})
export class DataSelectorSimpleDataTypeComponent implements DoCheck {

  @Input() dataSelector: CommonDataSelector;
  @Input() searchFields: FormGroup;

  fieldTypeEnum = FieldTypeEnum;

  constructor(
    private dataSelectorService: DataSelectorService
  ) { }

  ngDoCheck() {
    for (const code of this.dataSelector.simpleDataTypeBool.keys()) {
      const fieldName = this.dataSelector.getSimpleDataTypeFormName(code, FieldTypeEnum.bool);
      if (!this.searchFields.contains(fieldName)) {
        const initialValue = this.dataSelectorService.getSavedDataSelectorDataTypeFormValue(fieldName);
        this.searchFields.addControl(fieldName, new FormControl(initialValue));
      }
    }

    for (const code of this.dataSelector.simpleDataTypeText.keys()) {
      const fieldName = this.dataSelector.getSimpleDataTypeFormName(code, FieldTypeEnum.text);
      if (!this.searchFields.contains(fieldName)) {
        const initialValue = this.dataSelectorService.getSavedDataSelectorDataTypeFormValue(fieldName);
        this.searchFields.addControl(fieldName, new FormControl(initialValue));
      }
    }

    for (const code of this.dataSelector.simpleDataTypeNumber.keys()) {
      const fieldName = this.dataSelector.getSimpleDataTypeFormName(code, FieldTypeEnum.number);
      if (!this.searchFields.contains(fieldName)) {
        const initialValue = this.dataSelectorService.getSavedDataSelectorDataTypeFormValue(fieldName);
        this.searchFields.addControl(fieldName, new FormControl(initialValue));
      }
    }

  }

  hasDataTypeFormWithThisName(formFieldName: string) {
    return Object.keys(this.searchFields.controls).find((el: string) => el === formFieldName);
  }

  returnZero(): number {
    return 0;
  }

}
