import { Injectable } from '@angular/core';
import { CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../components/shared/confirm-dialog/confirm-dialog.component';

export interface ConfirmBeforeQuit {
  canQuit: boolean;
}

@Injectable()
export class ConfirmBeforeQuitGuard implements CanDeactivate<ConfirmBeforeQuit> {

  constructor(
    public confirmDialog: MatDialog
  ) { }

  canDeactivate(
    component: ConfirmBeforeQuit,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (component.canQuit) {
      return true;
    } else {
      return this.confirmPopup();
    }
  }

  confirmPopup() {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent,
      { data: { title: 'info.continue?', message: 'info.loseData' } });
    return confirmDialogRef.afterClosed();
  }

}
