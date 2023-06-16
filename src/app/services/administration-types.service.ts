import { Injectable } from '@angular/core';
import { AdministrationTypes } from '../models/administration-types.model';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class AdministrationTypesService {

  private readonly baseUrl = 'administration-types';

  constructor(
    private esgbuApi: EsgbuApiService<AdministrationTypes>
  ) { }

  public getAllTypes() {
    return this.esgbuApi.getAll(this.baseUrl);
  }
}
