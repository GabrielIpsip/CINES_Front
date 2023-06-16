import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Establishments } from 'src/app/models/establishments.model';

@Component({
  selector: 'app-documentary-structure-establishment-search-dialog',
  templateUrl: './documentary-structure-establishment-search-dialog.component.html',
  styleUrls: ['./documentary-structure-establishment-search-dialog.component.scss']
})
export class DocumentaryStructureEstablishmentSearchDialogComponent {

  constructor(
    public dialogRef: MatDialogRef<DocumentaryStructureEstablishmentSearchDialogComponent>
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onChangeEstablishment($event: Establishments) {
    this.dialogRef.close($event);
  }
}
