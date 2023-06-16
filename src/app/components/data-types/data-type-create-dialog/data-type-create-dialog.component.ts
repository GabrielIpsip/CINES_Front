import { Component, ViewChild, Inject, ChangeDetectorRef, AfterViewChecked, Input } from '@angular/core';
import { DataTypeViewComponent } from '../data-type-view/data-type-view.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataTypes } from 'src/app/models/data-types.model';
import { Groups } from 'src/app/models/groups.model';
import { DataTypesService } from 'src/app/services/data-types.service';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { TextsService } from 'src/app/services/texts.service';
import { Observable } from 'rxjs';
import { Constraints } from 'src/app/models/constraints.model';
import { NumbersService } from 'src/app/services/numbers.service';
import { OperationsService } from 'src/app/services/operations.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GroupNode } from 'src/app/common/group-node';

@Component({
  selector: 'app-data-type-create-dialog',
  templateUrl: './data-type-create-dialog.component.html',
  styleUrls: ['./data-type-create-dialog.component.scss']
})
export class DataTypeCreateDialogComponent implements AfterViewChecked {

  @ViewChild(DataTypeViewComponent)
  dataTypeView: DataTypeViewComponent;

  @Input() dataTypes: DataTypes;

  constructor(
    public dialogRef: MatDialogRef<DataTypeCreateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      group: Groups,
      dataType: DataTypes,
      groupList: Groups[],
      nodes: GroupNode[]
    },
    private cdRef: ChangeDetectorRef,
    private dataTypesService: DataTypesService,
    private textsService: TextsService,
    private numbersService: NumbersService,
    private operationsService: OperationsService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onApplyClick() {
    const dataTypeBody = this.dataTypeView.getNewValues();
    if (this.data.dataType == null) {
      dataTypeBody.groupId = this.data.group.id;
    }

    if (this.data.dataType == null) {
      this.dataTypesService.createDataType(dataTypeBody).subscribe({
        next: (response) => {
          this.addConstraint(response);
          this.data.dataType = response;
        },
        error: (error) => this.handleError(error)
      });
    } else {
      this.dataTypesService.updateDataType(this.data.dataType.id, dataTypeBody).subscribe({
        next: (response) => this.addConstraint(response),
        error: (error) => this.handleError(error)
      });
    }
  }

  addConstraint(dataType: DataTypes) {
    const constraints = this.dataTypeView.getConstraintNewValues();

    if (constraints == null) {
      this.dialogRef.close(dataType);
      return;
    }

    constraints.dataTypeId = dataType.id;

    const isCreation = dataType.constraint == null;
    let constraintObs: Observable<Constraints>;
    if (constraints == null) {
      this.dialogRef.close(dataType);
      return;
    }

    switch (dataType.type.name) {
      case TypesEnum.text:
        if (isCreation) {
          constraintObs = this.textsService.createTextInformation(constraints);
        } else {
          constraintObs = this.textsService.updateTextInformation(dataType.id, constraints);
        }
        break;

      case TypesEnum.number:
        if (isCreation) {
          constraintObs = this.numbersService.createNumberInformation(constraints);
        } else {
          constraintObs = this.numbersService.updateNumberInformation(dataType.id, constraints);
        }
        break;

      case TypesEnum.operation:
        if (isCreation) {
          constraintObs = this.operationsService.createOperationInformation(constraints);
        } else {
          constraintObs = this.operationsService.updateOperationInformation(dataType.id, constraints);
        }
        break;
    }

    if (constraintObs != null) {
      constraintObs.subscribe({
        next: () => this.dialogRef.close(dataType),
        error: (error) => {
          if (error.error === 'An operator doesn\'t exist.') {
            this.errorPopup('error.formulaOperatorNotExists');
          } else if (error.error === 'Formula error.' || error.status === 400) {
            this.errorPopup('error.formulaSyntax');
          }
        }
      });
    }
  }

  private handleError(error: any) {
    if (error.status === 409) {
      this.errorPopup('error.dataTypeAlreadyExists');
    } else if (error.status === 400 && error.error.startsWith('Default language')) {
      this.errorPopup('error.defaultLangMissing');
    }
  }

  private errorPopup(codeTranslation: string) {
    this.translate.stream(codeTranslation).subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
