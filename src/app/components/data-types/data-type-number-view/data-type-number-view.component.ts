import { Component, OnInit, Input } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Numbers } from 'src/app/models/numbers.model';
import { NumbersService } from 'src/app/services/numbers.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-data-type-number-view',
  templateUrl: './data-type-number-view.component.html',
  styleUrls: ['./data-type-number-view.component.scss']
})
export class DataTypeNumberViewComponent implements OnInit {

  @Input() dataType: DataTypes;

  constraint = new Numbers();

  readonly MIN = this.numbersServices.MIN;
  readonly MAX = this.numbersServices.MAX;
  readonly currentLang = this.translate.getDefaultLang();

  constraintForm = new FormGroup({
    minForm: new FormControl(''),
    maxForm: new FormControl(''),
    minAlertForm: new FormControl(''),
    maxAlertForm: new FormControl(''),
    evolutionMinForm: new FormControl('', [Validators.min(0)]),
    evolutionMaxForm: new FormControl('', [Validators.min(0)]),
    isDecimalForm: new FormControl(''),
  });

  constructor(
    private numbersServices: NumbersService,
    private translate: TranslateService
  ) { }

  get f() {
    return this.constraintForm.controls;
  }

  ngOnInit() {
    if (this.dataType.constraint != null) {
      this.constraint = this.dataType.constraint as Numbers;
    }
    this.initValues();
    this.updateValidators();
  }

  updateValidators() {
    const constraint = this.getNewValues();

    const minFormValidators = [];
    const maxFormValidators = [];
    const minAlertFormValidators = [];
    const maxAlertFormValidators = [];

    if (constraint.min != null) {
      maxFormValidators.push(Validators.min(constraint.min + 0.01));
      maxAlertFormValidators.push(Validators.min(constraint.min + 0.01));
      minAlertFormValidators.push(Validators.min(constraint.min));
    }

    if (constraint.max != null) {
      minFormValidators.push(Validators.max(constraint.max - 0.01));
      minAlertFormValidators.push(Validators.max(constraint.max - 0.01));
      maxAlertFormValidators.push(Validators.max(constraint.max));
    }

    if (constraint.minAlert != null) {
      minFormValidators.push(Validators.max(constraint.minAlert));
      maxFormValidators.push(Validators.min(constraint.minAlert));
      maxAlertFormValidators.push(Validators.min(constraint.minAlert + 0.01));
    }

    if (constraint.maxAlert != null) {
      minFormValidators.push(Validators.max(constraint.maxAlert));
      minAlertFormValidators.push(Validators.max(constraint.maxAlert - 0.01));
      maxFormValidators.push(Validators.min(constraint.maxAlert));
    }

    this.f.minForm.setValidators(minFormValidators);
    this.f.maxForm.setValidators(maxFormValidators);
    this.f.minAlertForm.setValidators(minAlertFormValidators);
    this.f.maxAlertForm.setValidators(maxAlertFormValidators);

    this.f.minForm.updateValueAndValidity();
    this.f.maxForm.updateValueAndValidity();
    this.f.minAlertForm.updateValueAndValidity();
    this.f.maxAlertForm.updateValueAndValidity();
  }

  getNewValues(): Numbers {
    this.constraint.dataTypeId = this.dataType.id;

    const min = this.f.minForm.value;
    const max = this.f.maxForm.value;
    const minAlert = this.f.minAlertForm.value;
    const maxAlert = this.f.maxAlertForm.value;
    const evolutionMin = this.f.evolutionMinForm.value;
    const evolutionMax = this.f.evolutionMaxForm.value;
    const isDecimal = this.f.isDecimalForm.value;

    this.constraint.min = (min != null || min === 0) ? min : null;
    this.constraint.max = (max != null || max === 0) ? max : null;
    this.constraint.minAlert = (minAlert != null || minAlert === 0) ? minAlert : null;
    this.constraint.maxAlert = (maxAlert != null || maxAlert === 0) ? maxAlert : null;
    this.constraint.evolutionMin = (evolutionMin != null || evolutionMin === 0) ? evolutionMin : null;
    this.constraint.evolutionMax = (evolutionMax != null || evolutionMax === 0) ? evolutionMax : null;
    this.constraint.isDecimal = (isDecimal != null) ? isDecimal : false;

    return this.constraint;
  }

  private initValues() {
    this.f.minForm.setValue(this.constraint.min);
    this.f.maxForm.setValue(this.constraint.max);
    this.f.minAlertForm.setValue(this.constraint.minAlert);
    this.f.maxAlertForm.setValue(this.constraint.maxAlert);
    this.f.evolutionMinForm.setValue(this.constraint.evolutionMin);
    this.f.evolutionMaxForm.setValue(this.constraint.evolutionMax);
    this.f.isDecimalForm.setValue(this.constraint.isDecimal);
  }

}
