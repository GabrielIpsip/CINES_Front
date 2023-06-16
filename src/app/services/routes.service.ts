import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FileItem } from '../common/FileItem';
import { Routes } from '../models/routes.model';
import { CommonService } from './common-service';
import { EnvironmentService } from './environment.service';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class RoutesService extends CommonService {

  public get MERCURE_KEY(): string {
    return 'http://esgbu.esr.gouv.fr/routes';
  }

  private readonly baseUrl = 'routes';

  readonly uploadImageMessage = 'routes-image-upload';

  readonly editorialRouteName = 'editorial';

  constructor(
    private esgbuApi: EsgbuApiService<Routes>,
    private esgbuApiAny: EsgbuApiService<any>,
    environmentService: EnvironmentService
  ) {
    super(environmentService);
  }

  getRootUrlImage(name: string): string {
    const url = this.esgbuApi.baseApiUrl + this.baseUrl + '/image/' + name;
    return this.esgbuApi.addCscrfToken(url);
  }

  getRouteByName(name: string, lang: string) {
    return this.esgbuApi.get(this.baseUrl + '/' + name + '?lang=' + lang, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateRouteByName(name: string, content: string, lang: string, skipLoader = false) {
    return this.esgbuApi.patch(this.baseUrl + '/' + name + '?lang=' + lang, { content }, skipLoader)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  deleteFile(fileUrl: string) {
    return this.esgbuApi.delete(this.baseUrl + '/document/' + fileUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getListFile(name: string, image = false): Observable<FileItem[]> {
    let url = this.baseUrl + '/document/' + name;
    if (image) {
      url += '?img=true';
    }

    return this.esgbuApiAny.get(url, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  uploadFile(name: string, file: File): Observable<{ docUrl: string }> {
    const formData = new FormData();
    formData.append('file', file);

    return this.esgbuApiAny.post(this.baseUrl + '/document/' + name, formData)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
