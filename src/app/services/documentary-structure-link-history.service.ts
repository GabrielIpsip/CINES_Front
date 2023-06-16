import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { DocumentaryStructureLinkHistory } from '../models/documentary-structure-link-history.model';
import { EsgbuApiService } from './esgbu-api.service';

class BodyDocStructLinkHistory {
  docStructId: number;
  establishmentId: number;
  surveyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentaryStructureLinkHistoryService {

  private readonly baseUrl = 'documentary-structure-link-history';

  constructor(
    private esgbuApi: EsgbuApiService<DocumentaryStructureLinkHistory>
  ) { }

  getLinkHistory(docStructId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?docStructId=' + docStructId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getLinkHistoryByEstablishment(establishmentId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?establishmentId=' + establishmentId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createOrUpdateLinkHistory(docStructId: number, establishmentId: number, surveyId: number) {
    const body: BodyDocStructLinkHistory = {
      docStructId,
      establishmentId,
      surveyId
    };

    return this.esgbuApi.put(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
