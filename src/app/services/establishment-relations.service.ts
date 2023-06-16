import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { EstablishmentRelations } from '../models/establishment-relations.model';
import { DatePipe } from '@angular/common';
import { BodyRelation } from '../common/body-relation.interface';

@Injectable({
  providedIn: 'root'
})
export class EstablishmentRelationsService {

  private readonly baseUrl = 'establishment-relations';

  constructor(
    private esgbuApi: EsgbuApiService<EstablishmentRelations>,
    private datePipe: DatePipe
  ) { }

  public getAsResult(id: number) {
    return this.esgbuApi.getAll(this.baseUrl + '/' + id + '?origin=false');
  }

  public createRelation(originIdP: number, resultIdP: number, typeIdP: number, startDateP: Date, endDateP: Date) {
    const formatStartDate = this.datePipe.transform(startDateP, 'yyyy-MM-dd');
    const formatEndDate = this.datePipe.transform(endDateP, 'yyyy-MM-dd');
    const relationPost: BodyRelation = {
      originId: originIdP,
      resultId: resultIdP,
      typeId: typeIdP,
      startDate: formatStartDate,
      endDate: formatEndDate
    };
    return this.esgbuApi.post(this.baseUrl, relationPost);
  }

  public deleteRelation(originId: number, resultId: number, typeId: number) {
    return this.esgbuApi.delete(this.baseUrl + '/' + originId + '/' + resultId + '/' + typeId);
  }
}


