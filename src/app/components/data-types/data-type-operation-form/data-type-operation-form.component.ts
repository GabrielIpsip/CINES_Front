import { Component, Input, OnChanges } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { Observable } from 'rxjs';
import { Operations } from 'src/app/models/operations.model';

@Component({
  selector: 'app-data-type-operation-form',
  templateUrl: './data-type-operation-form.component.html',
  styleUrls: ['./data-type-operation-form.component.scss'],
})
export class DataTypeOperationFormComponent implements OnChanges {

  @Input() surveyForm: FormGroup;
  @Input() dataType: DataTypes;
  @Input() constraint: Operations;
  @Input() initialValue: string;
  @Input() dataValues: string[];
  @Input() updateOperation: Observable<void>;

  private dataTypeId: string;
  private onInit = false;

  error = false;
  formControl: FormControl;

  constructor(
    private translate: TranslateService
  ) { }

  get f() {
    return this.surveyForm.get(this.dataTypeId);
  }

  get defaultLang() {
    return this.translate.getDefaultLang();
  }

  initialize() {
    if (this.onInit) {
      return;
    }
    this.onInit = true;
    this.dataTypeId = this.dataType.id.toString();
    this.formControl = new FormControl('');
    this.surveyForm.addControl(this.dataTypeId, this.formControl);
    this.updateOperation.subscribe(() => {
      this.updateValue();
    });
  }


  ngOnChanges() {
    if (this.onInit) {
      this.updateValue();
    }
    if (!this.f || !this.dataTypeId) {
      this.initialize();
      this.setInitialValue();
    }
  }

  private updateValue() {
    const value = this.formatNumber(this.dataValues[this.dataType.id]);
    this.f.enable();
    this.f.setValue(value);
    this.f.disable();
  }

  private setInitialValue() {

    if (this.error) {
      return;
    } else if (this.initialValue == null) {
      this.updateValue();
    } else {
      this.f.enable();
      this.f.setValue(this.formatNumber(this.initialValue));
      this.f.disable();
    }
  }

  private formatNumber(nb: string): string {
    const value = parseFloat(nb)
      .toLocaleString(this.defaultLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    if (value === 'NaN') {
      return null;
    } else {
      return value;
    }
  }

}
