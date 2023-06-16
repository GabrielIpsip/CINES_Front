import { Component, OnInit, Inject } from '@angular/core';
import { RelationTypes } from 'src/app/models/relation-types.model';
import { DocumentaryStructureRelations } from 'src/app/models/documentary-structure-relations.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RelationTypesService } from 'src/app/services/relation-types.service';
import { DocumentaryStructureRelationsService } from 'src/app/services/documentary-structure-relations.service';
import { DateAdapter } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-documentary-structure-relation-dialog',
  templateUrl: './documentary-structure-relation-dialog.component.html',
  styleUrls: ['./documentary-structure-relation-dialog.component.scss']
})
export class DocumentaryStructureRelationDialogComponent implements OnInit {

  listRelationTypes: RelationTypes[];
  resultDocStructId: number;
  listRelation: DocumentaryStructureRelations[];
  locale: string;

  relationForm: FormGroup = new FormGroup({
    typeForm: new FormControl('', [Validators.required]),
    startDateForm: new FormControl('', [Validators.required]),
    endDateForm: new FormControl('')
  });

  constructor(
    public dialogRef: MatDialogRef<DocumentaryStructureRelationDialogComponent>,
    private relationTypesService: RelationTypesService,
    private docStructRelationsService: DocumentaryStructureRelationsService,
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
    this.resultDocStructId = this.data.establishmentResultId;
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
    this.docStructRelationsService.createRelation(originId, this.resultDocStructId, typeId, startDate, endDate)
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
