import { Component, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Texts } from 'src/app/models/texts.model';
import { DataTypes } from 'src/app/models/data-types.model';
import { TranslateService } from '@ngx-translate/core';
import { TextsService } from 'src/app/services/texts.service';
import { StringTools } from 'src/app/utils/string-tools';

@Component({
  selector: 'app-data-type-text-form',
  templateUrl: './data-type-text-form.component.html',
  styleUrls: ['./data-type-text-form.component.scss'],
})
export class DataTypeTextFormComponent implements OnChanges {

  @Input() surveyForm: FormGroup;
  @Input() dataType: DataTypes;
  @Input() constraint: Texts;
  @Input() initialValue: string;
  @Input() enable: boolean;
  @Input() longText = false;

  @Output() value = new EventEmitter<string>();

  private dataTypeId: string;

  private readonly MIN_LENGTH = this.textsService.MIN_LENGHT;
  private readonly MAX_LENGTH = this.textsService.maxLengthShortTextField;

  minLength: number;
  maxLength: number;
  regex: RegExp;

  formControl: FormControl;
  onInit = false;

  selectMenuValues: string[];
  isSelectMenu: boolean;
  selectValue: string;

  constructor(
    private translate: TranslateService,
    private textsService: TextsService
  ) { }

  get f() {
    return this.surveyForm.get(this.dataTypeId);
  }

  initialize() {
    if (this.onInit) {
      return;
    }
    this.onInit = true;
    this.dataTypeId = this.dataType.id.toString();
    this.initializeConstraint();
    this.formControl = new FormControl('', this.getValidators());
    this.surveyForm.addControl(this.dataTypeId, this.formControl);

    if (this.constraint == null || this.constraint.regex == null) {
      this.isSelectMenu = false;
    } else {
      this.selectMenuValues = StringTools.getOptionValueFromRegexSelectWord(this.constraint.regex);
      this.isSelectMenu = this.selectMenuValues != null && this.selectMenuValues.length !== 0;
    }
  }

  ngOnChanges() {
    if (this.onInit && this.enable) {
      this.removeNDValue();
    }
    if (!this.f || !this.dataTypeId) {
      this.initialize();
    }
    this.setInitialValue();
  }

  onChangeValue(event?: any) {
    if (this.enable) {
      let value: string;
      if (event != null) {
        value = (event.value == null) ? '' : event.value;
      } else {
        value = this.formControl.value;
      }
      if (this.formControl.valid) {
        this.value.emit(value);
      }
    }
  }

  getValidators() {

    const validators = [];

    if (this.minLength != null) {
      validators.push(Validators.minLength(this.minLength));
    }
    if (this.maxLength != null) {
      validators.push(Validators.maxLength(this.maxLength));
    }
    if (this.regex != null && this.regex) {
      validators.push(Validators.pattern(this.regex));
    }

    return validators;
  }

  getInputIndicator(value: number): string {
    let message = '';
    let min = false;
    const locale = this.translate.getDefaultLang();
    if (this.minLength !== this.MIN_LENGTH) {
      message += this.minLength.toLocaleString(locale) + ' / ' + value;
      min = true;
    }
    if (this.maxLength !== this.MAX_LENGTH) {
      if (!min) {
        message += value.toLocaleString(locale);
      }
      message += ' / ' + this.maxLength.toLocaleString(locale);
    }
    return message;
  }

  private setInitialValue() {
    if (this.initialValue == null) {
      return;
    }

    if (this.initialValue === 'ND') {
      this.setNDValue();
      return;
    }

    if (this.isSelectMenu) {
      this.selectValue = this.initialValue;
    } else {
      this.f.setValue(this.initialValue);
    }
  }

  private initializeConstraint() {
    if (!this.constraint) {
      this.constraint = new Texts(this.MIN_LENGTH, this.MAX_LENGTH);
    }

    this.minLength = (this.constraint.minLength == null) ? this.MIN_LENGTH : this.constraint.minLength;
    this.maxLength = (this.constraint.maxLength == null) ? this.MAX_LENGTH : this.constraint.maxLength;
    try {
      if (this.constraint.regex != null) {
        this.regex = new RegExp('^' + this.constraint.regex + '$');
      }
    } catch (error) {
      console.error('Invalid regex : "' + this.constraint.regex + '" for ' + this.dataType.code);
    }
  }

  private setNDValue() {
    this.f.setValue('ND');
    this.f.disable();
  }

  private removeNDValue() {
    this.f.enable();
    this.f.setValue(null);
  }

}
