import { AfterViewChecked, Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcast-main-menu',
  templateUrl: './broadcast-main-menu.component.html',
  styleUrls: ['./broadcast-main-menu.component.scss']
})
export class BroadcastMainMenuComponent implements AfterViewChecked {

  @Input() mainMenuAllMenuUrl: string[];
  @Input() footerAllMenuUrl: string[];

  readonly editorial = '/editorials/list';
  readonly databaseExport = '/broadcast/database-export';
  readonly dataSelector = '/broadcast/data-selector';
  readonly indicators = '/broadcast/indicators';
  readonly keyFigures = '/broadcast/key-figures';

  readonly allMenuUrl = [this.editorial, this.databaseExport,
  this.dataSelector, this.indicators, this.keyFigures];

  activeMenu: string;

  constructor(
    private router: Router
  ) { }

  ngAfterViewChecked() {
    const currentUrl = this.router.url;
    if (this.allMenuUrl.indexOf(currentUrl) > -1) {
      this.activeMenu = currentUrl;
    } else if (this.mainMenuAllMenuUrl?.indexOf(currentUrl) > -1 || this.footerAllMenuUrl?.indexOf(currentUrl) > -1
      || currentUrl === '/') {
      this.activeMenu = '';
    }
  }

}
