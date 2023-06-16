import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { RelationTypes } from '../models/relation-types.model';

@Injectable({
  providedIn: 'root'
})
export class RelationTypesService {

  private readonly baseUrl = 'relation-types';

  constructor(
    private esgbuApi: EsgbuApiService<RelationTypes>
  ) { }

  public getAllTypes() {
    return this.esgbuApi.getAll(this.baseUrl);
  }
}
