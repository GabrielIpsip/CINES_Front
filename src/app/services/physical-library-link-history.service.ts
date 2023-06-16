import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { PhysicalLibraryLinkHistory } from '../models/physical-library-link-history.model';
import { EsgbuApiService } from './esgbu-api.service';

class BodyPhysicLibLinkHistory {
  physicLibId: number;
  docStructId: number;
  surveyId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicalLibraryLinkHistoryService {

  private readonly baseUrl = 'physical-library-link-history';

  constructor(
    private esgbuApi: EsgbuApiService<PhysicalLibraryLinkHistory>
  ) { }

  getLinkHistory(physicLibId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?physicLibId=' + physicLibId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getLinkHistoryByDocStruct(docStructId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?docStructId=' + docStructId)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createOrUpdateLinkHistory(physicLibId: number, docStructId: number, surveyId: number) {
    const body: BodyPhysicLibLinkHistory = {
      physicLibId,
      docStructId,
      surveyId
    };

    return this.esgbuApi.put(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
