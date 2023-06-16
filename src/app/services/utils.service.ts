import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { EncodingEnum } from '../common/encodingEnum.enum';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  private readonly baseUrl = 'utils';

  constructor(
    private esgbuApi: EsgbuApiService<any>,
  ) { }

  encodeString(encoding: EncodingEnum, fileName: string, content: string) {
    const body = { encoding, fileName, content };
    return this.esgbuApi.post(this.baseUrl + '/encode', body, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  downloadFile(url: string) {
    return this.esgbuApi.get(url, false)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
