import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { DocumentaryStructureViewComponent } from '../documentary-structure-view/documentary-structure-view.component';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-documentary-structure-update',
  templateUrl: './documentary-structure-update.component.html',
  styleUrls: ['./documentary-structure-update.component.scss']
})
export class DocumentaryStructureUpdateComponent implements OnInit, AfterViewChecked, OnDestroy, ConfirmBeforeQuit {

  @ViewChild(DocumentaryStructureViewComponent)
  docStructView: DocumentaryStructureViewComponent;

  docStructId: number;
  docStructToUpdate: DocumentaryStructures;

  canQuit = false;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private esgbuService: ESGBUService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.docStructId = this.activatedRoute.snapshot.params.id;
    this.docStructsService.getDocStruct(this.docStructId).subscribe(response => {
      this.docStructToUpdate = response;
      this.esgbuService.setTitle(this.docStructToUpdate.useName);
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  updateDocStruct() {
    const newDocStruct: DocumentaryStructures = this.docStructView.getNewValues();
    this.docStructsService.updateDocStruct(this.docStructId, newDocStruct).subscribe(response => {
      this.docStructToUpdate = response;
      this.updatePopup();
      this.canQuit = true;
      this.router.navigate(['/documentary-structures/' + this.docStructId]);
    });
  }

  updatePopup() {
    this.translate.stream('docStruct.updatePopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }
}
