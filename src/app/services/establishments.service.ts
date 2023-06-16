import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Establishments } from '../models/establishments.model';
import { GlobalProgress } from '../models/global-progress.model';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface BodyEstablishment {
  officialName: string;
  useName: string;
  acronym: string;
  brand: string;
  active: boolean;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  instruction: string;
  typeId: number;
  departmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class EstablishmentsService {

  private readonly baseUrl = 'establishments';

  private establishmentListSubject = new BehaviorSubject<Establishments[]>([]);
  private establishmentListObs = this.establishmentListSubject.asObservable();

  private hasSearchSubject = new BehaviorSubject<boolean>(false);
  private hasSearchObs = this.hasSearchSubject.asObservable();

  private establishmentListProgressSubject = new BehaviorSubject<Establishments[]>([]);
  private establishmentListProgressObs = this.establishmentListProgressSubject.asObservable();

  private hasSearchProgressSubject = new BehaviorSubject<boolean>(false);
  private hasSearchProgressObs = this.hasSearchProgressSubject.asObservable();

  private storedResultList: Establishments[];
  private storedResultProgressList: Establishments[];

  private searchKeyword: string;
  private searchKeywordProgress: string;

  constructor(
    private esgbuApi: EsgbuApiService<Establishments>,
    private esgbuApiProgress: EsgbuApiService<GlobalProgress>
  ) { }

  getGlobalProgress() {
    return this.esgbuApiProgress.get(this.baseUrl + '/global-progress')
      .pipe(catchError(this.esgbuApiProgress.handleError));
  }

  getEstablishment(id: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  searchEstablishment(request: string, progress = false, totalProgress = false) {
    let url = this.baseUrl + '?filters=' + request;
    if (progress) {
      url += '&progress=true';
    }
    if (totalProgress) {
      url += '&totalProgress=true';
    }
    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateEstablishment(id: number, establishment: Establishments) {
    const establishmentPost = this.convertEstablishmentToPost(establishment);
    return this.esgbuApi.put(this.baseUrl + '/' + id, establishmentPost)
      .pipe(catchError(this.esgbuApi.handleError));

  }

  createEstablishment(establishment: Establishments) {
    const establishmentPost = this.convertEstablishmentToPost(establishment);
    return this.esgbuApi.post(this.baseUrl, establishmentPost)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateEstablishmentList(list: Establishments[], progress = false) {
    if (progress) {
      this.establishmentListProgressSubject.next(list);
    } else {
      this.establishmentListSubject.next(list);
    }
  }

  saveResultList(progress = false) {
    if (progress) {
      this.storedResultProgressList = this.establishmentListProgressSubject.value;
    } else {
      this.storedResultList = this.establishmentListSubject.value;
    }
  }

  setSaveResultList(progress = false) {
    if (progress) {
      this.establishmentListProgressSubject.next(this.storedResultProgressList);
    } else {
      this.establishmentListSubject.next(this.storedResultList);
    }
  }

  setsearchKeyWord(keyword: string, progress = false) {
    if (progress) {
      this.searchKeywordProgress = keyword;
    } else {
      this.searchKeyword = keyword;
    }
  }

  getSearchKeyword(progress = false): string {
    if (progress) {
      return this.searchKeywordProgress;
    } else {
      return this.searchKeyword;
    }
  }

  cleanEstablishmentList(progress = false) {
    if (progress) {
      this.establishmentListProgressSubject.next([]);
    } else {
      this.establishmentListSubject.next([]);
    }
  }

  getEstablishmentList(progress = false) {
    if (progress) {
      return this.establishmentListProgressObs;
    } else {
      return this.establishmentListObs;
    }
  }

  updateHasSearch(value: boolean, progress = false) {
    if (progress) {
      this.hasSearchProgressSubject.next(value);
    } else {
      this.hasSearchSubject.next(value);
    }
  }

  getHasSearch(progress = false) {
    if (progress) {
      return this.hasSearchProgressObs;
    } else {
      return this.hasSearchObs;
    }
  }

  private convertEstablishmentToPost(establishment: Establishments): BodyEstablishment {
    const postEstablishment = {
      officialName: establishment.officialName,
      useName: establishment.useName,
      acronym: establishment.acronym,
      brand: establishment.brand,
      active: establishment.active,
      address: establishment.address,
      city: establishment.city,
      postalCode: establishment.postalCode,
      website: establishment.website,
      instruction: establishment.instruction,
      typeId: establishment.type.id,
      departmentId: establishment.department.id
    };
    return postEstablishment;
  }

}
