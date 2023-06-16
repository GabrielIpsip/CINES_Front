import { Component, OnInit, Input } from '@angular/core';
import { DataTypes } from 'src/app/models/data-types.model';
import { Operations } from 'src/app/models/operations.model';
import { DataTypeConstraintView } from 'src/app/common/data-type-constraint-view.interface';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-type-operation-view',
  templateUrl: './data-type-operation-view.component.html',
  styleUrls: ['./data-type-operation-view.component.scss']
})
export class DataTypeOperationViewComponent implements OnInit, DataTypeConstraintView {

  @Input() dataType: DataTypes;

  constraint = new Operations();

  constraintForm = new FormGroup({
    formulaForm: new FormControl('', [Validators.maxLength(255), Validators.required])
  });

  get f() {
    return this.constraintForm.controls;
  }

  ngOnInit() {
    if (this.dataType.constraint != null) {
      this.constraint = this.dataType.constraint as Operations;
    }
    this.initValues();
  }

  getNewValues(): Operations {
    this.constraint.dataTypeId = this.dataType.id;

    const formula = this.f.formulaForm.value;

    if (formula != null && formula.length > 0) {
      this.constraint.formula = formula;
    } else {
      this.constraint.formula = null;
    }

    return this.constraint;
  }

  isValid(): boolean {
    return this.constraintForm.valid;
  }

  private initValues() {
    this.f.formulaForm.setValue(this.constraint.formula);
  }

}
