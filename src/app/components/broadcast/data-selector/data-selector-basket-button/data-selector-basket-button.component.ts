import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TooltipComponent } from '@angular/material/tooltip';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { DataSelectorBasketDialogComponent } from '../data-selector-basket-dialog/data-selector-basket-dialog.component';

@Component({
  selector: 'app-data-selector-basket-button',
  templateUrl: './data-selector-basket-button.component.html',
  styleUrls: ['./data-selector-basket-button.component.scss']
})
export class DataSelectorBasketButtonComponent implements OnInit, OnDestroy {

  matToolTipMessage = '';

  nbrAdministrationInBasket: number;
  nbrEstablishmentInBasket: number;
  nbrDocStructInBasket: number;
  nbrPhysicLibInBasket: number;

  onChangeSelectedAdministrationSubscription: Subscription;

  constructor(
    private dataSelectorService: DataSelectorService,
    private dialog: MatDialog,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.setNbrAdministration();
    this.initMatToolTipMessage();

    this.dataSelectorService.onChangeSelectedAdministrationObs.subscribe({
      next: (value) => {
        if (value) {
          this.setNbrAdministration();
          this.initMatToolTipMessage();
        }
      }
    });

    this.authorizeHtmlInMatToolTip();
  }

  ngOnDestroy() {
    if (this.onChangeSelectedAdministrationSubscription != null) {
      this.onChangeSelectedAdministrationSubscription.unsubscribe();
    }
  }

  openDialog() {
    const dialogRef = this.dialog.open(DataSelectorBasketDialogComponent);

    dialogRef.afterClosed().subscribe({
      next: (value) => {
        if (value) {
          this.dataSelectorService.notifyOnValidateSelection();
        }
      }
    });
  }

  onClickUseMySelectionButton() {
    this.dataSelectorService.notifyOnValidateSelection();
  }

  private setNbrAdministration() {

    this.nbrEstablishmentInBasket = this.dataSelectorService
      .getSelectedAdministration(AdministrationTypesEnum.ESTABLISHMENT).length;

    this.nbrDocStructInBasket = this.dataSelectorService
      .getSelectedAdministration(AdministrationTypesEnum.DOC_STRUCT).length;

    this.nbrPhysicLibInBasket = this.dataSelectorService
      .getSelectedAdministration(AdministrationTypesEnum.PHYSIC_LIB).length;

    this.nbrAdministrationInBasket =
      this.nbrEstablishmentInBasket + this.nbrDocStructInBasket + this.nbrPhysicLibInBasket;
  }

  private initMatToolTipMessage() {
    this.matToolTipMessage = '';
    this.setMatTootlTipMessage(AdministrationTypesEnum.ESTABLISHMENT, this.nbrEstablishmentInBasket);
    this.setMatTootlTipMessage(AdministrationTypesEnum.DOC_STRUCT, this.nbrDocStructInBasket);
    this.setMatTootlTipMessage(AdministrationTypesEnum.PHYSIC_LIB, this.nbrPhysicLibInBasket);
  }

  private setMatTootlTipMessage(administrationType: AdministrationTypesEnum, nbrAdministration: number) {
    if (nbrAdministration > 0) {
      let code = 'db.administrationTypes.';
      if (nbrAdministration > 1) {
        code += 'plural.';
      }
      code += administrationType;

      this.translate.get(code).subscribe({
        next: (value: string) => {
          this.matToolTipMessage += '<p>' + value + ' : <strong>' + nbrAdministration + '</strong> ' + '</p>';
        }
      });
    }
  }

  private authorizeHtmlInMatToolTip() {
    try {
      Object.defineProperty(TooltipComponent.prototype, 'message', {
        set(v: any) {
          const el = document.querySelectorAll('.mat-tooltip');

          if (el) {
            el[el.length - 1].innerHTML = v;
          }
        },
      });
    }
    catch (error) { /* Do nothing */ }
  }

}
