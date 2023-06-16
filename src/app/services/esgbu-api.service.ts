import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { throwError, Observable } from 'rxjs';
import { EnvironmentService } from './environment.service';
import version from '../../assets/version.json';
import { skipLoaderHeader } from '../interceptors/loader.interceptor';

@Injectable({
  providedIn: 'root'
})
export class EsgbuApiService<T> {

  private static csrfToken: string;

  private baseApiWithSlash: string;
  private readonly parameters = { withCredentials: true };

  constructor(
    private httpClient: HttpClient,
    private envService: EnvironmentService
  ) { }

  static setCsrfToken(token: string) {
    EsgbuApiService.csrfToken = token;
  }

  get version(): string {
    return version.apiVersion;
  }

  get baseApiUrl(): string {
    const envUrl = this.envService.environment.apiUrl;
    if (this.baseApiWithSlash == null) {
      this.baseApiWithSlash = (envUrl.slice(-1) !== '/') ? envUrl + '/' : envUrl;
    }
    return this.baseApiWithSlash;
  }

  private get showLog(): boolean {
    return this.envService.environment.log;
  }

  printLog(logMessage: string) {
    if (this.showLog) {
      console.log(logMessage);
    }
  }

  get(path: string, publicAPI = false, csrfTokenName: string = null): Observable<T> {
    let url: string = publicAPI ? this.baseApiUrl + 'public/' + path : this.baseApiUrl + path;
    if (csrfTokenName != null) {
      url = this.addCscrfToken(url, csrfTokenName);
    }
    this.printLog('[GET] On API service using url : ' + url);
    return this.httpClient.get<T>(url, this.parameters);
  }

  getAll(path: string, publicAPI = false): Observable<T[]> {
    const url: string = publicAPI ? this.baseApiUrl + 'public/' + path : this.baseApiUrl + path;
    this.printLog('[GET] On API service using url : ' + url);
    return this.httpClient.get<T[]>(url, this.parameters);
  }

  put(path: string, body: object): Observable<T> {
    let url: string = this.baseApiUrl + path;
    url = this.addCscrfToken(url);
    this.printLog('[PUT] On API service using url : ' + url);
    return this.httpClient.put<T>(url, body, this.parameters);
  }

  post(path: string, body: object, publicAPI = false): Observable<T> {
    let url: string = publicAPI ? this.baseApiUrl + 'public/' + path : this.baseApiUrl + path;
    if (!publicAPI) {
      url = this.addCscrfToken(url);
    }
    this.printLog('[POST] On API service using url : ' + url);
    return this.httpClient.post<T>(url, body, this.parameters);
  }

  delete(path: string): Observable<T> {
    let url: string = this.baseApiUrl + path;
    url = this.addCscrfToken(url);
    this.printLog('[DELETE] On API service using url : ' + url);
    return this.httpClient.delete<T>(url, this.parameters);
  }

  patch(path: string, body: object, skipLoader = false): Observable<T> {
    let url: string = this.baseApiUrl + path;
    url = this.addCscrfToken(url);
    this.printLog('[PATCH] On API service using url : ' + url);
    let parameter: {} = this.parameters;
    if (skipLoader) {
      const headers = new HttpHeaders().set(skipLoaderHeader, '');
      parameter = Object.assign({ headers }, parameter);
    }

    return this.httpClient.patch<T>(url, body, parameter);
  }

  addCscrfToken(urlStr: string, tokenParamName = 'token'): string {
    if (EsgbuApiService.csrfToken == null) {
      return urlStr;
    }

    const url: URL = new URL(urlStr);
    url.searchParams.append(tokenParamName, EsgbuApiService.csrfToken);
    return url.toString();
  }

  handleError(httpError: HttpErrorResponse) {
    if (httpError != null) {
      return throwError(httpError);
    }
  }
}
