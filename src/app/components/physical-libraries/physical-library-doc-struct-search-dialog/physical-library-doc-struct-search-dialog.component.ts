import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';

@Component({
  selector: 'app-physical-library-doc-struct-search-dialog',
  templateUrl: './physical-library-doc-struct-search-dialog.component.html',
  styleUrls: ['./physical-library-doc-struct-search-dialog.component.scss']
})
export class PhysicalLibraryDocStructSearchDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<PhysicalLibraryDocStructSearchDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { associated: boolean }
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeDocStruct($event: DocumentaryStructures) {
    this.dialogRef.close($event);
  }

}
