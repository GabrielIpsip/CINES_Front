import { Injectable } from '@angular/core';
import { States } from '../models/states.model';
import { EsgbuApiService } from './esgbu-api.service';

@Injectable({
  providedIn: 'root'
})
export class StatesService {

  private readonly baseUrl = 'states';

  constructor(
    private esgbuApi: EsgbuApiService<States>
  ) { }

  public getAllStates() {
    return this.esgbuApi.getAll(this.baseUrl);
  }
}
