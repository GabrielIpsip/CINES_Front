import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { PhysicalLibraries } from '../models/physical-libraries.model';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';

interface BodyPhysicLib {
  useName: string;
  officialName: string;
  address: string;
  city: string;
  postalCode: string;
  active: boolean;
  instruction: string;
  sortOrder: number;
  fictitious: boolean;
  docStructId: number;
  departmentId: number;
}

@Injectable({
  providedIn: 'root'
})
export class PhysicalLibrariesService {

  private readonly baseUrl = 'physical-libraries';
  private physicLibListSubject = new BehaviorSubject<PhysicalLibraries[]>([]);
  private physicLibListObs = this.physicLibListSubject.asObservable();
  private hasSearchSubject = new BehaviorSubject<boolean>(false);
  private hasSearchObs = this.hasSearchSubject.asObservable();
  private storedResultList: PhysicalLibraries[];

  private searchKeyWord: string;

  constructor(
    private esgbuApi: EsgbuApiService<PhysicalLibraries>
  ) { }

  getPhysicLib(id: number) {
    return this.esgbuApi.get(this.baseUrl + '/' + id)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updatePhysicLib(id: number, physicLib: PhysicalLibraries) {
    const physicLibPost = this.convertPhysicLibToPost(physicLib);
    return this.esgbuApi.put(this.baseUrl + '/' + id, physicLibPost)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createPhysicLib(physicLib: PhysicalLibraries) {
    const physicLibPost = this.convertPhysicLibToPost(physicLib);
    return this.esgbuApi.post(this.baseUrl, physicLibPost)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  searchPhysicLib(request: string) {
    return this.esgbuApi.getAll(this.baseUrl + '?filters=' + request)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getAllByDocStructId(docStructId: number, progress = false, active = false, surveyId = 0) {
    let url = this.baseUrl + '?docStructId=' + docStructId;
    if (progress) {
      url += '&progress=true';
    }
    if (active) {
      url += '&active=true';
    }

    if (surveyId != 0) {
      url += '&surveyId=' + surveyId;
    }
    return this.esgbuApi.getAll(url)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updatePhysicLibList(list: PhysicalLibraries[]) {
    this.physicLibListSubject.next(list);
  }

  cleanPhysicLibList() {
    this.physicLibListSubject.next([]);
  }

  getPhysicLibList() {
    return this.physicLibListObs;
  }

  updateHasSearch(value: boolean) {
    this.hasSearchSubject.next(value);
  }

  getHasSearch() {
    return this.hasSearchObs;
  }

  SaveResultList() {
    this.storedResultList = this.physicLibListSubject.value;
  }

  setSaveResultList() {
    this.physicLibListSubject.next(this.storedResultList);
  }

  setSearchKeyword(keyword: string) {
    this.searchKeyWord = keyword;
  }

  getSearchKeyword(): string {
    return this.searchKeyWord;
  }

  private convertPhysicLibToPost(physicLib: PhysicalLibraries): BodyPhysicLib {
    const postPhysicLib = {
      useName: physicLib.useName,
      officialName: physicLib.officialName,
      address: physicLib.address,
      city: physicLib.city,
      postalCode: physicLib.postalCode,
      active: physicLib.active,
      instruction: physicLib.instruction,
      sortOrder: physicLib.sortOrder,
      fictitious: physicLib.fictitious,
      docStructId: physicLib.docStructId,
      departmentId: physicLib.department.id
    };
    return postPhysicLib;
  }
}
