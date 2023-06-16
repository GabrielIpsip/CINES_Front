import { KeyValue } from '@angular/common';
import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DocumentaryStructureLinkHistory } from 'src/app/models/documentary-structure-link-history.model';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Surveys } from 'src/app/models/surveys.model';
import { DocumentaryStructureLinkHistoryService } from 'src/app/services/documentary-structure-link-history.service';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';

@Component({
  selector: 'app-establishment-doc-struct-list',
  templateUrl: './establishment-doc-struct-list.component.html',
  styleUrls: ['./establishment-doc-struct-list.component.scss']
})
export class EstablishmentDocStructListComponent implements OnInit, OnChanges {

  @Input() establishmentId: number;
  @Input() surveys: Surveys[];

  docStructList: DocumentaryStructures[];
  surveyList = new Map<number, Surveys>();
  docStructHistory = new Map<number, DocumentaryStructureLinkHistory[]>();

  lastSurvey: Surveys;

  showNoDocStructMessage = false;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    private docStructLinkHistoryService: DocumentaryStructureLinkHistoryService
  ) { }

  ngOnInit() {
    this.docStructsService.getAllByEstablishmentId(this.establishmentId).subscribe({
      next: (response) => this.docStructList = response,
      error: (error) => {
        if (error.status === 404) {
          this.showNoDocStructMessage = true;
        }
      }
    });

    this.docStructLinkHistoryService.getLinkHistoryByEstablishment(this.establishmentId).subscribe({
      next: (response) => {
        for (const historyLine of response) {
          if (this.docStructHistory.has(historyLine.surveyId)) {
            this.docStructHistory.get(historyLine.surveyId).push(historyLine);
          } else {
            this.docStructHistory.set(historyLine.surveyId, [historyLine]);
          }
        }
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });
  }

  ngOnChanges() {
    if (this.surveyList.size > 0 || this.surveys == null || this.lastSurvey != null) {
      return;
    }

    this.lastSurvey = this.surveys[0];
    for (const survey of this.surveys.slice(1)) {
      this.surveyList.set(survey.id, survey);
    }
  }

  keyDescOrder(a: KeyValue<number, DocumentaryStructureLinkHistory[]>,
               b: KeyValue<number, DocumentaryStructureLinkHistory[]>): number {
    return a.key > b.key ? -1 : (b.key > a.key ? 1 : 0);
  }

}
