import { Component, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { StringTools } from 'src/app/utils/string-tools';

@Component({
  selector: 'app-data-type-boolean-form',
  templateUrl: './data-type-boolean-form.component.html',
  styleUrls: ['./data-type-boolean-form.component.scss']
})
export class DataTypeBooleanFormComponent implements OnChanges {

  @Input() dataType: DataTypes;
  @Input() initialValue: string;
  @Input() enable: boolean;

  @Output() value = new EventEmitter<boolean>();

  private dataTypeId: string;
  private oldState: boolean;

  checkBoxValue: boolean;

  onInit = false;

  initialize() {
    if (this.onInit) {
      return;
    }
    this.onInit = true;
    this.dataTypeId = this.dataType.id.toString();
    this.setInitialValue();
  }

  ngOnChanges() {
    if (this.onInit && this.enable === true && this.oldState !== this.enable) {
      this.checkBoxValue = false;
    }
    if (!this.dataTypeId) {
      this.initialize();
    }
    this.oldState = this.enable;
  }

  private setInitialValue() {
    if (this.initialValue == null) {
      this.checkBoxValue = false;
      this.onChangeValue();
      return;
    }

    this.checkBoxValue = StringTools.strToBool(this.initialValue);
  }

  onChangeValue() {
    this.value.emit(this.checkBoxValue);
  }

}
