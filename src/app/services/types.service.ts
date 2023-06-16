import { Injectable } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { Types } from '../models/types.model';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class TypesService {

  private readonly baseUrl = 'types';

  constructor(
    private esgbuApi: EsgbuApiService<Types>
  ) { }

  public getAllTypes() {
    return this.esgbuApi.getAll(this.baseUrl)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
