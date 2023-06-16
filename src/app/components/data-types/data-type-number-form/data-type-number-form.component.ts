import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { DataTypes } from 'src/app/models/data-types.model';
import { Numbers } from 'src/app/models/numbers.model';
import { BehaviorSubject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { strIntegerValidator } from 'src/app/validators/str-integer.validators';
import { strMinValidator } from 'src/app/validators/str-min.validators';
import { strMaxValidator } from 'src/app/validators/str-max.validators';
import { StringTools } from 'src/app/utils/string-tools';
import { NumbersService } from 'src/app/services/numbers.service';
import { DataValuesService, EtabDepDocCheckBudget } from 'src/app/services/data-values.service';

@Component({
  selector: 'app-data-type-number-form',
  templateUrl: './data-type-number-form.component.html',
  styleUrls: ['./data-type-number-form.component.scss'],
})
export class DataTypeNumberFormComponent implements OnChanges {

  @Input() surveyForm: FormGroup;
  @Input() dataType: DataTypes;
  @Input() constraint: Numbers;
  @Input() initialValue: string;
  @Input() oldValue: string;
  @Input() enable: boolean;

  @Output() value = new EventEmitter<string>();

  private dataTypeId: string;

  private readonly MIN = this.numbersService.MIN;
  private readonly MAX = this.numbersService.MAX;
  private readonly IS_DECIMAL = this.numbersService.IS_DECIMAL;
  private onInit = false;

  min: number;
  max: number;
  isDecimal: boolean;
  minAlert: number;
  maxAlert: number;
  evolutionMin: number;
  evolutionMax: number;

  private minAlertSubject = new BehaviorSubject<boolean>(false);
  private maxAlertSubject = new BehaviorSubject<boolean>(false);
  private evolutionMinAlertSubject = new BehaviorSubject<boolean>(false);
  private evolutionMaxAlertSubject = new BehaviorSubject<boolean>(false);

  minAlertObs = this.minAlertSubject.asObservable();
  maxAlertObs = this.maxAlertSubject.asObservable();
  evolutionMinAlertObs = this.evolutionMinAlertSubject.asObservable();
  evolutionMaxAlertObs = this.evolutionMaxAlertSubject.asObservable();

  private depDocAlertSubject = new BehaviorSubject<EtabDepDocCheckBudget>(null);
  depDocAlertObs = this.depDocAlertSubject.asObservable();

  formControl: FormControl;

  constructor(
    private translate: TranslateService,
    private numbersService: NumbersService,
    private dataValuesService: DataValuesService
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
    this.initializeConstraint();
    this.formControl = new FormControl('', this.getValidators());
    this.surveyForm.addControl(this.dataTypeId, this.formControl);
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

  onChangeValue() {
    if (this.enable) {
      const value = StringTools.strToNumber(
        this.formControl.value, this.isDecimal, this.defaultLang);
      if (this.formControl.valid) {
        const valueStr = (this.isDecimal) ? (Math.round(value * 100) / 100).toFixed(2) : value.toString();
        this.value.emit(valueStr);
      } else if (this.f.hasError('required')) {
        this.updateAlert(null);
      }
    }
  }

  private updateAlert(value: number) {
    const oldValue = StringTools.strToNumber(this.oldValue, true, this.defaultLang);
    this.updateMinAlert(value);
    this.updateMaxAlert(value);
    this.updateEvolutionMinAlert(value, oldValue);
    this.updateEvolutionMaxAlert(value, oldValue);
    this.updateDepDocAlert();
  }

  getInfoMessage(): string {
    let message: string;
    if (this.isDecimal) {
      this.translate.stream('dataType.numbers.decimal').subscribe({
        next: (value) => message = value
      });
    } else {
      this.translate.stream('dataType.numbers.integer').subscribe({
        next: (value) => message = value
      });
    }

    if (this.min !== this.MIN) {
      message += '. Min: ' + this.min.toLocaleString(this.defaultLang);
    }
    if (this.max !== this.MAX) {
      message += '. Max: ' + this.max.toLocaleString(this.defaultLang);
    }
    return message;
  }

  getAlertMaxMessage(): string {
    let message: string;
    this.translate.stream('dataType.numbers.maxAlert').subscribe({
      next: (value) => message = value + ' ' + this.maxAlert
    });
    return message;
  }

  getAlertMinMessage(): string {
    let message: string;
    this.translate.stream('dataType.numbers.minAlert').subscribe({
      next: (value) => message = value + ' ' + this.minAlert
    });
    return message;
  }

  getAlertEvolutionMinMessage(): string {
    let message: string;
    this.translate.stream('dataType.numbers.minAlertPercent').subscribe({
      next: (value) => message = value + ' ' + this.evolutionMin + '%'
    });
    return message;
  }

  getAlertEvolutionMaxMessage(): string {
    let message: string;
    this.translate.stream('dataType.numbers.maxAlertPercent').subscribe({
      next: (value) => message = value + ' ' + this.evolutionMax + '%'
    });
    return message;
  }

  getAlertDepDocMessage(): string {
    let message: string;
    const budgetValue: EtabDepDocCheckBudget = this.depDocAlertSubject.value;
    this.translate.stream('dataType.numbers.depDocAlert').subscribe({
      next: (value) => message = value
        + ' '
        + budgetValue.EtabDepDoc.toLocaleString(this.defaultLang)
        + ' < '
        + budgetValue.sumDepDTot.toLocaleString(this.defaultLang)
    });
    return message;
  }

  replaceSeparator(event: KeyboardEvent) {
    if (this.defaultLang === 'fr' && event.key === '.') {
      this.formControl.setValue(this.formControl.value + ',');
      event.preventDefault();
    }
  }

  private updateEvolutionMinAlert(value: number, oldValue: number) {
    if (this.evolutionMin != null && oldValue != null && value != null) {
      const threshold = oldValue - (oldValue * this.evolutionMin) / 100;
      return this.evolutionMinAlertSubject.next(value < threshold);
    } else {
      return this.evolutionMinAlertSubject.next(false);
    }
  }

  private updateEvolutionMaxAlert(value: number, oldValue: number) {
    if (this.evolutionMax != null && oldValue != null && value != null) {
      const threshold = oldValue + (oldValue * this.evolutionMax) / 100;
      return this.evolutionMaxAlertSubject.next(value > threshold);
    } else {
      return this.evolutionMaxAlertSubject.next(false);
    }
  }

  private updateMinAlert(value: number) {
    if (this.minAlert != null && value != null) {
      this.minAlertSubject.next(value < this.minAlert);
    } else {
      this.minAlertSubject.next(false);
    }
  }

  private updateMaxAlert(value: number) {
    if (this.maxAlert != null && value != null) {
      this.maxAlertSubject.next(value >= this.maxAlert);
    } else {
      this.maxAlertSubject.next(false);
    }
  }

  private updateDepDocAlert() {
    if (this.dataType.code === 'EtabDepDoc') {
      this.dataValuesService.checkBudget().subscribe({
        next: (response) => this.depDocAlertSubject.next(response),
        error: (error) => {
          if (error.status === 404) { /* Do nothing */ }
        }
      });
    }
  }

  private getValidators() {

    const validators = [];
    const locale = this.defaultLang;

    if (this.max != null) {
      validators.push(strMaxValidator(this.max, locale));
    }
    if (this.min != null) {
      validators.push(strMinValidator(this.min, locale));
    }
    if (!this.isDecimal) {
      validators.push(strIntegerValidator(locale));
    }
    const regex = StringTools.numberPattern(locale);
    validators.push(Validators.pattern(regex));

    return validators;
  }

  private setInitialValue() {
    if (this.initialValue == null) {
      return;
    }

    if (this.initialValue === 'ND') {
      this.setNDValue();
      this.updateAlert(null);
      return;
    }

    let value: number;
    if (this.isDecimal) {
      value = parseFloat(this.initialValue);
    } else {
      value = parseInt(this.initialValue, 10);
    }

    if (this.isDecimal) {
      this.f.setValue(value.toLocaleString(
        this.defaultLang, { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
    } else {
      this.f.setValue(value.toLocaleString(this.defaultLang));
    }
    this.updateAlert(value);
  }

  private setNDValue() {
    this.f.setValue('ND');
    this.f.disable();
  }

  private removeNDValue() {
    this.f.enable();
    this.f.setValue(null);
  }

  private initializeConstraint() {
    if (!this.constraint) {
      this.constraint = new Numbers(this.MIN, this.MAX, this.IS_DECIMAL);
    }

    this.min = (this.constraint.min == null) ? this.MIN : this.constraint.min;
    this.max = (this.constraint.max == null) ? this.MAX : this.constraint.max;
    this.isDecimal = this.constraint.isDecimal ? this.constraint.isDecimal : this.IS_DECIMAL;
    this.minAlert = this.constraint.minAlert;
    this.maxAlert = this.constraint.maxAlert;
    this.evolutionMin = this.constraint.evolutionMin;
    this.evolutionMax = this.constraint.evolutionMax;
  }


}
