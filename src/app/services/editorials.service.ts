import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FileItem } from '../common/FileItem';
import { Editorials, EditorialTabContent } from '../models/editorials.model';
import { CommonService } from './common-service';
import { EnvironmentService } from './environment.service';
import { EsgbuApiService } from './esgbu-api.service';

interface EditorialsBody {
  title: string;
  content: EditorialTabContent[];
  surveyId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class EditorialsService extends CommonService {

  private readonly baseUrl = 'editorials';

  readonly uploadImageMessage = 'editorials-image-upload';

  constructor(
    private esgbuApi: EsgbuApiService<Editorials>,
    private esgbuApiAny: EsgbuApiService<any>,
    environmentService: EnvironmentService
  ) {
    super(environmentService);
  }

  public get MERCURE_KEY(): string {
    return 'http://esgbu.esr.gouv.fr/editorials';
  }

  getRootUrlImage(surveyId: number): string {
    const url = this.esgbuApi.baseApiUrl + this.baseUrl + '/image/' + surveyId;
    return this.esgbuApi.addCscrfToken(url);
  }

  getEditorial(surveyId: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + surveyId, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllEditorials() {
    return this.esgbuApi.getAll(this.baseUrl, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateEditorial(surveyId: number, editorial: Editorials, skipLoader = false) {
    const body: EditorialsBody = {
      title: editorial.title,
      content: editorial.content
    };

    return this.esgbuApi.patch(this.baseUrl + '/' + surveyId, body, skipLoader)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createEditorial(surveyId: number, editorial: Editorials) {
    const body: EditorialsBody = {
      title: editorial.title,
      content: editorial.content,
      surveyId: (editorial.survey != null) ? editorial.survey.id : surveyId
    };

    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  uploadFile(surveyId: number, file: File): Observable<{ docUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.esgbuApiAny.post(this.baseUrl + '/document/' + surveyId, formData)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getListFile(surveyId: number, image = false): Observable<FileItem[]> {
    let url = this.baseUrl + '/document/' + surveyId;
    if (image) {
      url += '?img=true';
    }
    return this.esgbuApiAny.get(url, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  deleteFile(fileUrl: string) {
    return this.esgbuApi.delete(this.baseUrl + '/document/' + fileUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
