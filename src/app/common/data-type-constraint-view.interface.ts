import { Constraints } from '../models/constraints.model';
import { FormGroup } from '@angular/forms';

export interface DataTypeConstraintView {

  constraintForm: FormGroup;

  getNewValues(): Constraints;
}
