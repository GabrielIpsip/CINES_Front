import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { Translation } from 'src/app/common/translation.interface';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { EsgbuApiService } from '../esgbu-api.service';

export interface BodyIndicators {
  byRegion: boolean;
  byEstablishment: boolean;
  byDocStruct: boolean;
  global: boolean;
  keyFigure: boolean;
  active: boolean;
  displayOrder: number;
  administrator: boolean;
  prefix: string;
  suffix: string;
  names: Translation[];
  description: Translation[];
  query: any;
}

export enum AggregationType {
  global = 1,
  byRegion = 2,
  byEstablishment = 3,
  byDocStruct = 4
}

@Injectable({
  providedIn: 'root'
})
export class IndicatorsService {

  private readonly baseUrl = 'indicators';

  private keyFigureHiddenCard = new Map<AggregationType, number[]>();
  private indicatorHiddenCard = new Map<AggregationType, number[]>();

  constructor(
    private esgbuApi: EsgbuApiService<Indicators>,
    private translate: TranslateService
  ) { }

  getAllIndicators(year?: string, result?: boolean, withQuery?: boolean, lang?: string) {
    let url = this.baseUrl + '?lang=';

    if (lang == null) {
      url += this.translate.getDefaultLang();
    } else {
      url += lang;
    }

    url += '&';

    if (year != null) {
      url += 'year=' + year + '&';
    }

    if (result != null) {
      url += 'result=' + result + '&';
    }

    if (withQuery != null) {
      url += 'withQuery=' + withQuery + '&';
    }

    return this.esgbuApi.getAll(url, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getIndicator(id: number, year?: string, result?: boolean, withQuery?: boolean, lang?: string) {
    let url = this.baseUrl + '/' + id + '?lang=';

    if (lang == null) {
      url += this.translate.getDefaultLang();
    } else {
      url += lang;
    }

    url += '&';
    if (year != null) {
      url += 'year=' + year + '&';
    }

    if (result != null) {
      url += 'result=' + result + '&';
    }

    if (withQuery != null) {
      url += 'withQuery=' + withQuery + '&';
    }

    return this.esgbuApi.get(url, true)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createIndicator(body: BodyIndicators) {
    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateIndicator(indicatorId: number, body: BodyIndicators, result = false) {
    return this.esgbuApi.put(this.baseUrl + '/' + indicatorId + '?result=' + result, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  hideIndicatorInList(index: number, isKeyFigure: boolean, aggrType: AggregationType) {
    const map = this.getHiddenCard(isKeyFigure);

    if (map.has(aggrType)) {
      map.get(aggrType).push(index);
    } else {
      map.set(aggrType, [index]);
    }
  }

  isHideIndicatorInList(index: number, isKeyFigure: boolean, aggrType: AggregationType): boolean {
    const map = this.getHiddenCard(isKeyFigure);

    if (map.has(aggrType)) {
      return map.get(aggrType).includes(index);
    } else {
      return false;
    }
  }

  resetHiddenIndicatorInList(isKeyFigure: boolean, aggrType: AggregationType) {
    const map = this.getHiddenCard(isKeyFigure);
    if (map.has(aggrType)) {
      map.set(aggrType, []);
    }
  }

  hasHiddenCard(isKeyFigure: boolean, aggrType: AggregationType): boolean {
    const map = this.getHiddenCard(isKeyFigure);

    if (map.has(aggrType)) {
      return map.get(aggrType).length > 0;
    } else {
      return false;
    }
  }

  getHiddenCard(isKeyFigure: boolean): Map<AggregationType, number[]> {
    return isKeyFigure ? this.keyFigureHiddenCard : this.indicatorHiddenCard;
  }
}
