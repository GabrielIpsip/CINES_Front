import { Component, OnInit, Input } from '@angular/core';
import { RelationTypes } from 'src/app/models/relation-types.model';
import { DocumentaryStructureRelations } from 'src/app/models/documentary-structure-relations.model';
import { DocumentaryStructureRelationsService } from 'src/app/services/documentary-structure-relations.service';
import { RelationTypesService } from 'src/app/services/relation-types.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureRelationDialogComponent } from '../documentary-structure-relation-dialog/documentary-structure-relation-dialog.component';

@Component({
  selector: 'app-documentary-structure-relation',
  templateUrl: './documentary-structure-relation.component.html',
  styleUrls: ['./documentary-structure-relation.component.scss']
})
export class DocumentaryStructureRelationComponent implements OnInit {

  @Input() modificationMode: boolean;

  listRelationTypes: RelationTypes[];
  listResult: DocumentaryStructureRelations[];
  datePattern: string;
  private resultDocStructId: number;

  constructor(
    private docStructRelationService: DocumentaryStructureRelationsService,
    private relationTypesService: RelationTypesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public addRelationDialog: MatDialog
  ) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.resultDocStructId = this.activatedRoute.snapshot.params.id;
    this.translate.stream('pattern.date').subscribe({
      next: (value) => this.datePattern = value
    });
    this.relationTypesService.getAllTypes().subscribe(response => {
      this.listRelationTypes = response;
    });

    this.docStructRelationService.getAsResult(this.resultDocStructId).subscribe(response => {
      this.listResult = response;
    });
  }

  openAddRelationDialog(): void {
    const dialogRef = this.addRelationDialog.open(DocumentaryStructureRelationDialogComponent, {
      data: {
        listRelation: this.listResult,
        establishmentResultId: this.resultDocStructId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  removeRelation(originId: number, resultId: number, typeId: number) {
    this.docStructRelationService.deleteRelation(originId, resultId, typeId).subscribe({
      next: () => this.ngOnInit()
    });
  }

}
