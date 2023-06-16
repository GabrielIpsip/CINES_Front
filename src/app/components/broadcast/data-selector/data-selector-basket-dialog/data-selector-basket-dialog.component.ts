import { AfterViewChecked, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataSelectorBasketListComponent } from '../data-selector-basket-list/data-selector-basket-list.component';

@Component({
  selector: 'app-data-selector-basket-dialog',
  templateUrl: './data-selector-basket-dialog.component.html',
  styleUrls: ['./data-selector-basket-dialog.component.scss']
})
export class DataSelectorBasketDialogComponent implements AfterViewChecked {

  @ViewChild('establishmentList') establishmentList: DataSelectorBasketListComponent;
  @ViewChild('docStructList') docStructList: DataSelectorBasketListComponent;
  @ViewChild('physicLibList') physicLibList: DataSelectorBasketListComponent;

  administrationTypesEnum = AdministrationTypesEnum;

  constructor(
    private cdRef: ChangeDetectorRef
  ) { }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  cleanAllList() {
    this.establishmentList.cleanList();
    this.docStructList.cleanList();
    this.physicLibList.cleanList();
  }

  enableUseSelectionButton(): boolean {
    return this.establishmentList?.administrations?.length > 0
      || this.docStructList?.administrations?.length > 0
      || this.physicLibList?.administrations?.length > 0;
  }

}
