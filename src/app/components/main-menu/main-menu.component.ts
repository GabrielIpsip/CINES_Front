import { AfterViewChecked, Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss']
})
export class MainMenuComponent implements AfterViewChecked {

  @Input() broadcastAllMenuUrl: string[];
  @Input() footerAllMenuUrl: string[];

  readonly surveyConsultCurrent = '/surveys/consult-current';
  readonly surveyList = '/surveys/list';
  readonly surveyCreate = '/surveys/create';
  readonly dataTypeEdit = '/data-types/edit';
  readonly indicatorEdit = '/indicators/list';

  readonly establishmentSearch = '/establishments/search';
  readonly establishmentCreate = '/establishments/create';

  readonly docStructSearch = '/documentary-structures/search';
  readonly docStructCreate = '/documentary-structures/create';

  readonly physicLibSearch = '/physical-libraries/search';
  readonly physicLibCreate = '/physical-libraries/create';

  readonly userList = '/users/list';
  readonly userCreate = '/users/create';

  readonly allMenuUrl = [this.surveyConsultCurrent, this.surveyList,
  this.surveyCreate, this.dataTypeEdit, this.establishmentSearch,
  this.establishmentCreate, this.docStructSearch, this.docStructCreate,
  this.physicLibSearch, this.physicLibCreate, this.userList,
  this.userCreate, this.indicatorEdit];

  activeMenu: string;

  constructor(
    private rightsCheckerService: RightsCheckerService,
    private router: Router
  ) { }

  ngAfterViewChecked() {
    const currentUrl = this.router.url;
    if (this.allMenuUrl.indexOf(currentUrl) > -1) {
      this.activeMenu = currentUrl;
    } else if (this.broadcastAllMenuUrl?.indexOf(currentUrl) > -1 || this.footerAllMenuUrl?.indexOf(currentUrl) > -1
      || currentUrl === '/') {
      this.activeMenu = '';
    }
  }

  get rightsChecker() {
    return this.rightsCheckerService;
  }

  get MainMenuComponent() {
    return MainMenuComponent;
  }

}
