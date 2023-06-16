import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { PhysicalLibraryLinkHistory } from 'src/app/models/physical-library-link-history.model';
import { Surveys } from 'src/app/models/surveys.model';
import { PhysicalLibraryLinkHistoryService } from 'src/app/services/physical-library-link-history.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { PhysicalLibraryDocStructSearchDialogComponent } from '../physical-library-doc-struct-search-dialog/physical-library-doc-struct-search-dialog.component';

class LinkInfo {
  default: boolean;
  docStruct: DocumentaryStructures;
}

@Component({
  selector: 'app-physical-library-link-history',
  templateUrl: './physical-library-link-history.component.html',
  styleUrls: ['./physical-library-link-history.component.scss']
})
export class PhysicalLibraryLinkHistoryComponent implements OnInit, OnChanges {

  @Input() physicLib: PhysicalLibraries;
  @Input() defaultDocStruct: DocumentaryStructures;
  @Input() surveys: Surveys[];

  @Output() defaultDocStructEmitter = new EventEmitter<DocumentaryStructures>();

  isDiCoDoc = false;

  linkHistory = new Map<number, LinkInfo>();

  initialized = false;

  constructor(
    private physicLibLinkHistoryService: PhysicalLibraryLinkHistoryService,
    private rightsChecker: RightsCheckerService,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.isDiCoDoc = this.rightsChecker.isADMIN();
  }

  ngOnChanges() {
    if (!this.initialized && this.surveys != null && this.physicLib != null && this.physicLib.id != null) {
      this.initialized = true;
      this.physicLibLinkHistoryService.getLinkHistory(this.physicLib.id).subscribe({
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
    const dialogRef = this.dialog.open(PhysicalLibraryDocStructSearchDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.physicLibLinkHistoryService.createOrUpdateLinkHistory(this.physicLib.id, result.id, surveyId).subscribe({
          next: (response) => {
            this.linkHistory.set(surveyId, { default: false, docStruct: response.docStruct });
            if (this.surveys[0].id === surveyId) {
              this.defaultDocStruct = new DocumentaryStructures(response.docStruct);
              this.defaultDocStructEmitter.emit(this.defaultDocStruct);
              for (const [, linkInfo] of this.linkHistory) {
                if (linkInfo.default) {
                  linkInfo.docStruct = response.docStruct;
                }
              }
            }
          }
        });
      }
    });
  }

  private fillLinkHistoryMap(linkHistory?: PhysicalLibraryLinkHistory[]) {
    if (linkHistory != null) {
      for (const historyLine of linkHistory) {
        this.linkHistory.set(historyLine.surveyId, { default: false, docStruct: historyLine.docStruct });
      }
    }

    for (const survey of this.surveys) {
      if (!this.linkHistory.has(survey.id)) {
        this.linkHistory.set(survey.id, { default: true, docStruct: this.defaultDocStruct });
      }
    }
  }

}
