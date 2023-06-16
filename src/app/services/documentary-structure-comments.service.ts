import { Injectable } from '@angular/core';
import { DocumentaryStructureComments } from '../models/documentary-structure-comments.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';

interface BodyDocumentaryStructureComment {
  comment: string;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentaryStructureCommentsService {

  private readonly baseUrl = 'documentary-structure-comments';

  constructor(
    private esgbuApi: EsgbuApiService<DocumentaryStructureComments>
  ) { }

  createComment(surveyId: number, dataTypeId: number, docStructId: number, comment: string) {
    const newComment = new DocumentaryStructureComments(surveyId, docStructId, dataTypeId, comment);
    return this.esgbuApi.post(this.baseUrl, newComment)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateComment(surveyId: number, dataTypeId: number, docStructId: number, commentP: string) {
    const newComment: BodyDocumentaryStructureComment = { comment: commentP };
    return this.esgbuApi.patch(this.baseUrl + '/' + surveyId + '/' + docStructId + '/' + dataTypeId, newComment)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getComments(surveyId: number, dataTypeId: number, docStructId: number[], last: boolean = false) {
    let docStructParam = '';

    for (const id of docStructId) {
      docStructParam += id + ',';
    }

    let url = this.baseUrl + '?surveyId=' + surveyId + '&dataTypeId=' + dataTypeId + '&docStructId=' + docStructParam;

    if (last) {
      url += '&last=true';
    }

    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
