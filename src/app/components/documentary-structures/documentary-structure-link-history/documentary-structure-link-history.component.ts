import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentaryStructureLinkHistory } from 'src/app/models/documentary-structure-link-history.model';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Establishments } from 'src/app/models/establishments.model';
import { Surveys } from 'src/app/models/surveys.model';
import { DocumentaryStructureLinkHistoryService } from 'src/app/services/documentary-structure-link-history.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { DocumentaryStructureEstablishmentSearchDialogComponent } from '../documentary-structure-establishment-search-dialog/documentary-structure-establishment-search-dialog.component';

class LinkInfo {
  default: boolean;
  establishment: Establishments;
}

@Component({
  selector: 'app-documentary-structure-link-history',
  templateUrl: './documentary-structure-link-history.component.html',
  styleUrls: ['./documentary-structure-link-history.component.scss']
})
export class DocumentaryStructureLinkHistoryComponent implements OnInit, OnChanges {

  @Input() docStruct: DocumentaryStructures;
  @Input() defaultEstablishment: Establishments;
  @Input() surveys: Surveys[];

  @Output() defaultEstablishmentEmitter = new EventEmitter<Establishments>();

  isDiCoDoc = false;

  linkHistory = new Map<number, LinkInfo>();

  initialized = false;

  constructor(
    private docStructLinkHistoryService: DocumentaryStructureLinkHistoryService,
    private rightsChecker: RightsCheckerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isDiCoDoc = this.rightsChecker.isADMIN();
  }

  ngOnChanges() {
    if (!this.initialized && this.surveys != null && this.docStruct != null && this.docStruct.id != null) {
      this.initialized = true;
      this.docStructLinkHistoryService.getLinkHistory(this.docStruct.id).subscribe({
        next: (response) => this.fillLinkHistoryMap(response),
        error: (error) => {
          if (error.status === 404) {
            this.fillLinkHistoryMap();
          }
        }
      });
    }
  }

  openDialog(surveyId: number) {
    const dialogRef = this.dialog.open(DocumentaryStructureEstablishmentSearchDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.docStructLinkHistoryService.createOrUpdateLinkHistory(this.docStruct.id, result.id, surveyId).subscribe({
          next: (response) => {
            this.linkHistory.set(surveyId, { default: false, establishment: response.establishment });
            if (this.surveys[0].id === surveyId) {
              this.defaultEstablishment = new Establishments(response.establishment);
              this.defaultEstablishmentEmitter.emit(this.defaultEstablishment);
              for (const [, linkInfo] of this.linkHistory) {
                if (linkInfo.default) {
                  linkInfo.establishment = response.establishment;
                }
              }
            }
          }
        });
      }
    });
  }

  private fillLinkHistoryMap(linkHistory?: DocumentaryStructureLinkHistory[]) {
    if (linkHistory != null) {
      for (const historyLine of linkHistory) {
        this.linkHistory.set(historyLine.surveyId, { default: false, establishment: historyLine.establishment });
      }
    }

    for (const survey of this.surveys) {
      if (!this.linkHistory.has(survey.id)) {
        this.linkHistory.set(survey.id, { default: true, establishment: this.defaultEstablishment });
      }
    }
  }

}
