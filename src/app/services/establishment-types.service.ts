import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { EstablishmentTypes } from '../models/establishment-types.model';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentTypesService {

  private readonly baseUrl = 'establishment-types';

  constructor(
    private esgbuApi: EsgbuApiService<EstablishmentTypes>
  ) { }

  public getAllTypes() {
    return this.esgbuApi.getAll(this.baseUrl);
  }

}
