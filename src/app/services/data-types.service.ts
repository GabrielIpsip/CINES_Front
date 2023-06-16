import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { DataTypes } from '../models/data-types.model';
import { catchError } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Translation } from '../common/translation.interface';

export interface BodyDataTypes {
  code: string;
  codeEu: string;
  groupId: number;
  typeId: number;
  groupOrder: number;
  administrator: boolean;
  private: boolean;
  facet: boolean;
  simplifiedFacet: boolean;
  names: Translation[];
  measureUnits: Translation[];
  instructions: Translation[];
  definitions: Translation[];
  dates: Translation[];
}

@Injectable({
  providedIn: 'root'
})
export class DataTypesService {

  private readonly baseUrl = 'data-types';

  constructor(
    private esgbuApi: EsgbuApiService<DataTypes>,
    private translate: TranslateService
  ) { }

  getAllDataTypesByGroup(groupId: number) {
    return this.esgbuApi.getAll(this.baseUrl + '?groupId=' + groupId + '&lang=' + this.translate.getDefaultLang())
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllDataTypesOrdered(lang?: string, publicApi = true) {
    if (lang == null) {
      lang = this.translate.getDefaultLang();
    }
    return this.esgbuApi.getAll(this.baseUrl + '?lang=' + lang, publicApi)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getDataType(dataTypeId: number, lang?: string) {
    if (lang == null) {
      lang = this.translate.getDefaultLang();
    }
    return this.esgbuApi.get(this.baseUrl + '/' + dataTypeId + '?lang=' + lang)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createDataType(body: BodyDataTypes) {
    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateDataType(dataTypeId: number, body: BodyDataTypes) {
    return this.esgbuApi.put(this.baseUrl + '/' + dataTypeId, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
