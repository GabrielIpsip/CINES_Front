import { Injectable } from '@angular/core';
import { DocumentaryStructures } from '../models/documentary-structures.model';
import { EsgbuApiService } from './esgbu-api.service';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface BodyDocumentaryStructure {
  officialName: string;
  useName: string;
  acronym: string;
  active: boolean;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  instruction: string;
  establishmentId: number;
  departmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class DocumentaryStructuresService {

  private readonly baseUrl = 'documentary-structures';
  private docStructListSubject = new BehaviorSubject<DocumentaryStructures[]>([]);
  private docStructListObs = this.docStructListSubject.asObservable();
  private hasSearchSubject = new BehaviorSubject<boolean>(false);
  private hasSearchObs = this.hasSearchSubject.asObservable();
  private storedResultList: DocumentaryStructures[];

  private searchKeyWord: string;

  constructor(
    private esgbuApi: EsgbuApiService<DocumentaryStructures>
  ) { }

  getDocStruct(id: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllByEstablishmentId(establishmentId: number, progress = false, totalProgress = false) {
    let url = this.baseUrl + '?establishmentId=' + establishmentId;
    if (progress) {
      url += '&progress=true';
    }
    if (totalProgress) {
      url += '&totalProgress=true';
    }
    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllDocStruct(progress = false, totalProgress = false, associated = false) {
    let url = this.baseUrl;
    url += '?progress=' + progress + '&totalProgress=' + totalProgress + '&associated=' + associated;

    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createDocStruct(docStruct: DocumentaryStructures) {
    return this.esgbuApi.post(this.baseUrl, this.convertDocStructToPost(docStruct))
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateDocStruct(id: number, docStruct: DocumentaryStructures) {
    return this.esgbuApi.put(this.baseUrl + '/' + id, this.convertDocStructToPost(docStruct))
      .pipe(catchError(this.esgbuApi.handleError));

  }

  searchDocStruct(request: string, associated = false) {
    if (associated == null) {
      associated = false;
    }
    return this.esgbuApi.getAll(this.baseUrl + '?filters=' + request + '&associated=' + associated)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateDocStructList(list: DocumentaryStructures[]) {
    this.docStructListSubject.next(list);
  }

  cleanDocStructList() {
    this.docStructListSubject.next([]);
  }

  getDocStructList() {
    return this.docStructListObs;
  }

  updateHasSearch(value: boolean) {
    this.hasSearchSubject.next(value);
  }

  getHasSearch() {
    return this.hasSearchObs;
  }

  SaveResultList() {
    this.storedResultList = this.docStructListSubject.value;
  }

  setSaveResultList() {
    this.docStructListSubject.next(this.storedResultList);
  }

  setSearchKeyword(keyword: string) {
    this.searchKeyWord = keyword;
  }

  getSearchKeyword(): string {
    return this.searchKeyWord;
  }

  private convertDocStructToPost(docStruct: DocumentaryStructures): BodyDocumentaryStructure {
    return {
      officialName: docStruct.officialName,
      useName: docStruct.useName,
      acronym: docStruct.acronym,
      active: docStruct.active,
      address: docStruct.address,
      city: docStruct.city,
      postalCode: docStruct.postalCode,
      website: docStruct.website,
      instruction: docStruct.instruction,
      departmentId: docStruct.department.id,
      establishmentId: docStruct.establishmentId,
    };
  }
}
