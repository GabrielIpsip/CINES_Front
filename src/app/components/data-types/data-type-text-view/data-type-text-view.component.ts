import { Component, OnInit, Input } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { Texts } from 'src/app/models/texts.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { DataTypeConstraintView } from 'src/app/common/data-type-constraint-view.interface';
import { TextsService } from 'src/app/services/texts.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-type-text-view',
  templateUrl: './data-type-text-view.component.html',
  styleUrls: ['./data-type-text-view.component.scss']
})
export class DataTypeTextViewComponent implements OnInit, DataTypeConstraintView {

  @Input() dataType: DataTypes;

  constraint = new Texts();

  readonly MIN_LENGHT = this.textsService.MIN_LENGHT;
  readonly MAX_LENGTH = this.textsService.maxLengthShortTextField;
  readonly currentLang = this.translate.getDefaultLang();

  constraintForm = new FormGroup({
    minLengthForm: new FormControl(''),
    maxLengthForm: new FormControl(''),
    regexForm: new FormControl('', [Validators.maxLength(65535)]),
  });

  constructor(
    private textsService: TextsService,
    private translate: TranslateService
  ) { }

  get f() {
    return this.constraintForm.controls;
  }

  ngOnInit() {
    if (this.dataType.constraint != null) {
      this.constraint = this.dataType.constraint as Texts;
    }
    this.initValues();
    this.updateValidators();
  }

  updateValidators() {
    const minLenghtFormMaxValue = this.f.maxLengthForm.value;
    const maxLenghtFormMinValue = this.f.minLengthForm.value;

    const minLengthFormValidators = [Validators.min(0)];
    const maxLengthFormValidators = [Validators.max(65535)];

    if (minLenghtFormMaxValue != null && minLenghtFormMaxValue) {
      minLengthFormValidators.push(Validators.max(minLenghtFormMaxValue - 1));
    } else {
      minLengthFormValidators.push(Validators.max(65534));
    }
    this.f.minLengthForm.setValidators(minLengthFormValidators);

    if (maxLenghtFormMinValue != null && maxLenghtFormMinValue) {
      maxLengthFormValidators.push(Validators.min(maxLenghtFormMinValue + 1));
    } else {
      maxLengthFormValidators.push(Validators.min(1));
    }
    this.f.maxLengthForm.setValidators(maxLengthFormValidators);

    this.f.minLengthForm.updateValueAndValidity();
    this.f.maxLengthForm.updateValueAndValidity();
  }

  getNewValues(): Texts {
    this.constraint.dataTypeId = this.dataType.id;

    const minLength = this.f.minLengthForm.value;
    const maxLength = this.f.maxLengthForm.value;
    const regex = this.f.regexForm.value;

    if (minLength != null || minLength === 0) {
      this.constraint.minLength = minLength;
    } else {
      this.constraint.minLength = null;
    }

    if (maxLength != null && maxLength > minLength) {
      this.constraint.maxLength = maxLength;
    } else {
      this.constraint.maxLength = null;
    }

    if (regex != null && regex.length > 0) {
      this.constraint.regex = regex;
    } else {
      this.constraint.regex = null;
    }

    return this.constraint;
  }

  isValid(): boolean {
    return this.constraintForm.valid;
  }

  private initValues() {
    this.f.minLengthForm.setValue(this.constraint.minLength);
    this.f.maxLengthForm.setValue(this.constraint.maxLength);
    this.f.regexForm.setValue(this.constraint.regex);
  }

}
