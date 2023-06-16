import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentaryStructureViewComponent } from '../documentary-structure-view/documentary-structure-view.component';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-documentary-structure-create',
  templateUrl: './documentary-structure-create.component.html',
  styleUrls: ['./documentary-structure-create.component.scss']
})
export class DocumentaryStructureCreateComponent implements OnInit, AfterViewChecked, ConfirmBeforeQuit {

  @ViewChild(DocumentaryStructureViewComponent)
  docStructView: DocumentaryStructureViewComponent;

  docStructToCreate: DocumentaryStructures;

  canQuit = false;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.docStructToCreate = new DocumentaryStructures();
  }

  ngAfterViewChecked() {
      this.cdRef.detectChanges();
  }

  createDocStruct() {
    const newDocStruct: DocumentaryStructures = this.docStructView.getNewValues();
    this.docStructsService.createDocStruct(newDocStruct).subscribe(response => {
      this.docStructToCreate = response;
      this.createPopup();
      this.canQuit = true;
      this.router.navigate(['/documentary-structures/' + this.docStructToCreate.id]);
    });
  }

  createPopup() {
    this.translate.stream('docStruct.createPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }
}
