import { Component, OnInit, Input } from '@angular/core';
import { EstablishmentRelationsService } from 'src/app/services/establishment-relations.service';
import { RelationTypes } from 'src/app/models/relation-types.model';
import { RelationTypesService } from 'src/app/services/relation-types.service';
import { EstablishmentRelations } from 'src/app/models/establishment-relations.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { EstablishmentRelationDialogComponent } from 'src/app/components/establishments/establishment-relation-dialog/establishment-relation-dialog.component';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-establishment-relation',
  templateUrl: './establishment-relation.component.html',
  styleUrls: ['./establishment-relation.component.scss']
})
export class EstablishmentRelationComponent implements OnInit {

  @Input() modificationMode: boolean;

  listRelationTypes: RelationTypes[];
  listResult: EstablishmentRelations[];
  datePattern: string;
  private resultEstablishmentId: number;

  constructor(
    private establishmentRelationService: EstablishmentRelationsService,
    private relationTypesService: RelationTypesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    public addRelationDialog: MatDialog
  ) { }

  ngOnInit() {
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.resultEstablishmentId = this.activatedRoute.snapshot.params.id;
    this.translate.stream('pattern.date').subscribe({
      next: (value) => this.datePattern = value
    });
    this.relationTypesService.getAllTypes().subscribe(response => {
      this.listRelationTypes = response;
    });

    this.establishmentRelationService.getAsResult(this.resultEstablishmentId).subscribe(response => {
      this.listResult = response;
    });
  }

  openAddRelationDialog(): void {
    const dialogRef = this.addRelationDialog.open(EstablishmentRelationDialogComponent, {
      data: {
        listRelation: this.listResult,
        establishmentResultId: this.resultEstablishmentId
      }
    });

    dialogRef.afterClosed().subscribe(() => {
      this.ngOnInit();
    });
  }

  removeRelation(originId: number, resultId: number, typeId: number) {
    this.establishmentRelationService.deleteRelation(originId, resultId, typeId).subscribe({
      next: () => this.ngOnInit()
    });
  }

}
