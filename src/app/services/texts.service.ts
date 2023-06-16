import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Texts } from '../models/texts.model';
import { catchError } from 'rxjs/operators';
import { Constraints } from '../models/constraints.model';

@Injectable({
  providedIn: 'root'
})
export class TextsService {

  private readonly baseUrl = 'texts';

  readonly maxLengthShortTextField = 64;
  readonly MIN_LENGHT = 0;

  constructor(
    private esgbuApi: EsgbuApiService<Texts>
  ) { }

  getAllTextsInformation() {
    return this.esgbuApi.getAll(this.baseUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createTextInformation(textInfo: Constraints) {
    return this.esgbuApi.post(this.baseUrl, textInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateTextInformation(id: number, textInfo: Constraints) {
    return this.esgbuApi.put(this.baseUrl + '/' + id, textInfo)
      .pipe(catchError(this.esgbuApi.handleError));
  }

}
