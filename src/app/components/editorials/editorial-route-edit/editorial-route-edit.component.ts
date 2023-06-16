import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTab, MatTabGroup, MatTabHeader } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { Lang } from 'src/app/common/lang.interface';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { RoutesService } from 'src/app/services/routes.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { EditorialRouteEditorComponent } from '../editorial-route-editor/editorial-route-editor.component';

@Component({
  selector: 'app-editorial-route-edit',
  templateUrl: './editorial-route-edit.component.html',
  styleUrls: ['./editorial-route-edit.component.scss']
})
export class EditorialRouteEditComponent implements OnInit, AfterViewInit, ConfirmBeforeQuit {

  editorialRouteName: string;

  @ViewChild('tabGroup') tabs: MatTabGroup;
  @ViewChild('editor') editor: EditorialRouteEditorComponent;

  canQuit = false;

  constructor(
    private esgbuService: ESGBUService,
    private routesService: RoutesService,
    private confirmDialog: MatDialog
  ) { }

  get availableLang(): Lang[] {
    return this.esgbuService.AVAILABLE_LANG;
  }

  ngOnInit() {
    this.editorialRouteName = this.routesService.editorialRouteName;
  }

  updateCanQuit(value: boolean) {
    this.canQuit = value;
  }

  ngAfterViewInit() {
    if (this.tabs != null) {
      this.tabs._handleClick = this.confirmBeforeQuit.bind(this);
    }
  }

  confirmBeforeQuit(tab: MatTab, tabHeader: MatTabHeader, idx: number): boolean {
    this.confirmDialog.open(ConfirmDialogComponent, { data: { title: 'info.continue?', message: 'info.loseData' } })
      .afterClosed()
      .subscribe({
        next: (ok) => {
          if (ok) {
            this.tabs.selectedIndex = idx;
          }
        }
      });
    return false;
  }

}
