import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Groups } from '../models/groups.model';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AdministrationTypes } from '../models/administration-types.model';
import { GroupNode } from '../common/group-node';
import { Translation } from '../common/translation.interface';
import { AdministrationTypesEnum } from '../common/administration-types.enum';

export interface BodyGroups {
  parentGroupId: number;
  administrationTypeId: number;
  titles: Translation[];
}

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  private readonly baseUrl = 'groups';

  private selectedGroupSubject = new BehaviorSubject<Groups>(new Groups());
  private selectedGroupObs = this.selectedGroupSubject.asObservable();

  private selectedGroupTitleSubject = new BehaviorSubject<string>('');
  private selectedGroupTitleObs = this.selectedGroupTitleSubject.asObservable();

  constructor(
    private esgbuApi: EsgbuApiService<Groups>,
    private translate: TranslateService
  ) { }

  getAllGroups(publicAPI = false) {
    return this.esgbuApi.getAll(this.baseUrl + '?lang=' + this.translate.getDefaultLang(), publicAPI)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getGroup(groupId: number, lang?: string) {
    if (lang == null) {
      lang = this.translate.getDefaultLang();
    }
    return this.esgbuApi.get(this.baseUrl + '/' + groupId + '?lang=' + lang)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createGroup(body: BodyGroups) {
    return this.esgbuApi.post(this.baseUrl, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateGroup(id: number, body: BodyGroups) {
    return this.esgbuApi.put(this.baseUrl + '/' + id, body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getGroupsByAdministrationType(administrationType: AdministrationTypes) {
    return this.esgbuApi.getAll(this.baseUrl + '?lang=' + this.translate.getDefaultLang() +
      '&administrationType=' + administrationType.name)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  getGroupsByAdministrationTypeName(administrationType: AdministrationTypesEnum) {
    return this.esgbuApi.getAll(this.baseUrl + '?lang=' + this.translate.getDefaultLang() +
      '&administrationType=' + administrationType)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateSelectedGroup(group: Groups) {
    const oldGroup = new Groups(this.selectedGroupSubject.value);
    const newGroup = new Groups(group);
    //if (!oldGroup.equals(newGroup)) {
      this.selectedGroupSubject.next(group);
    //}
  }

  updateSelectedGroupTitle(title: string) {
    this.selectedGroupTitleSubject.next(title);
  }

  getSelectedGroup() {
    return this.selectedGroupObs;
  }

  getSelectedGroupTitle() {
    return this.selectedGroupTitleObs;
  }

  createGroupTitle(groupId: number, nodes: GroupNode[]): string {
    const node = nodes[groupId];
    if (node == null) {
      return '';
    } else if (node.title == null) {
      return '';
    } else if (node.parentGroupId == null) {
      return node.title;
    } else {
      return this.createGroupTitle(node.parentGroupId, nodes) + ' > ' + node.title;
    }
  }
}
