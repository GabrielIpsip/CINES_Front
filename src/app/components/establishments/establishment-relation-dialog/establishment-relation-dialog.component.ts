import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RelationTypesService } from 'src/app/services/relation-types.service';
import { RelationTypes } from 'src/app/models/relation-types.model';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { EstablishmentRelationsService } from 'src/app/services/establishment-relations.service';
import { EstablishmentRelations } from 'src/app/models/establishment-relations.model';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-establishment-relation-dialog',
  templateUrl: './establishment-relation-dialog.component.html',
  styleUrls: ['./establishment-relation-dialog.component.scss']
})
export class EstablishmentRelationDialogComponent implements OnInit {

  listRelationTypes: RelationTypes[];
  resultEstablishmentId: number;
  listRelation: EstablishmentRelations[];
  locale: string;

  relationForm: FormGroup = new FormGroup({
    typeForm: new FormControl('', [Validators.required]),
    startDateForm: new FormControl('', [Validators.required]),
    endDateForm: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<EstablishmentRelationDialogComponent>,
    private relationTypesService: RelationTypesService,
    private establishmentRelationsService: EstablishmentRelationsService,
    private dateAdapter: DateAdapter<Date>,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dateAdapter.setLocale(this.translate.getDefaultLang());
  }

  get f() {
    return this.relationForm.controls;
  }

  ngOnInit() {
    this.locale = this.translate.getDefaultLang();
    this.dateAdapter.setLocale(this.locale);
    this.resultEstablishmentId = this.data.establishmentResultId;
    this.listRelation = this.data.listRelation;
    this.relationTypesService.getAllTypes().subscribe(response => {
      this.listRelationTypes = response;
    });
  }

  onChangeOriginId($event: number) {
    const originId: number = $event;
    const startDate: Date = this.relationForm.controls.startDateForm.value;
    const endDate: Date = this.relationForm.controls.endDateForm.value;
    const typeId: number = this.relationForm.controls.typeForm.value;
    this.establishmentRelationsService.createRelation(originId, this.resultEstablishmentId, typeId, startDate, endDate)
      .subscribe({
        next: () => this.dialogRef.close(),
        error: (error) => {
          if (error.status === 409) {
            this.errorPopup();
          }
        }
      });
  }

  errorPopup() {
    this.translate.stream('error.relationAlreadyExists').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
