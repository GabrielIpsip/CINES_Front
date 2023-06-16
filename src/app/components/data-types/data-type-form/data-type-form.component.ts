import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { FormGroup } from '@angular/forms';
import { Constraints } from 'src/app/models/constraints.model';
import { Observable } from 'rxjs';
import { DataTypeTextFormComponent } from '../data-type-text-form/data-type-text-form.component';

@Component({
  selector: 'app-data-type-form',
  templateUrl: './data-type-form.component.html',
  styleUrls: ['./data-type-form.component.scss']
})
export class DataTypeFormComponent implements OnInit {

  @Input() dataType: DataTypes;
  @Input() surveyForm: FormGroup;
  @Input() constraint: Constraints;
  @Input() initialValue: string;
  @Input() oldValue: string;
  @Input() dataValues: string[];
  @Input() updateOperation: Observable<void>;
  @Input() longText = false;

  @Output() value = new EventEmitter<[number, string]>();

  @ViewChild('textField') textField: DataTypeTextFormComponent;

  NDchecked: boolean;

  TypesEnum = TypesEnum;

  ngOnInit() {

    if (this.initialValue === 'ND') {
      this.NDchecked = true;
    }
  }

  onChangeNumberValue(value: string) {
    if (value === 'NaN') {
      value = null;
    }
    this.emitValue(value);
  }

  onChangeTextValue(value: string) {
    if (value.length === 0) {
      value = null;
    }
    if (value === 'ND') {
      this.NDchecked = true;
      this.onChangeNDState();
      return;
    }
    this.emitValue(value);
  }

  onChangeBooleanValue(value: boolean) {
    if (value != null) {
      this.emitValue(String(value));
    }
  }

  onChangeNDState() {
    if (this.NDchecked) {
      this.emitValue('ND');
    } else {
      if (this.dataType.type.name === this.TypesEnum.boolean) {
        this.emitValue('false');
      } else {
        this.emitValue(null);
      }
    }
  }

  emitValue(value: string) {
    this.value.emit([this.dataType.id, value]);
  }

}
