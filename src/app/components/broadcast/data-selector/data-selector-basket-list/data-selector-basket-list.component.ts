import { Component, Input, OnInit } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

@Component({
  selector: 'app-data-selector-basket-list',
  templateUrl: './data-selector-basket-list.component.html',
  styleUrls: ['./data-selector-basket-list.component.scss']
})
export class DataSelectorBasketListComponent implements OnInit {

  @Input() administrationType: AdministrationTypesEnum;

  hasAdministration = true;

  administrations: BroadcastAdministration[];

  constructor(
    private dataSelectorService: DataSelectorService
  ) { }

  ngOnInit() {
    this.administrations = this.dataSelectorService.getSelectedAdministration(this.administrationType);
    this.hasAdministration = this.administrations?.length > 0;
  }

  cleanList() {
    this.dataSelectorService.clearSelectedAdministration(this.administrationType);
    this.administrations = this.dataSelectorService.getSelectedAdministration(this.administrationType);
    this.hasAdministration = false;
  }

  deleteAdministration(index: number) {
    this.administrations.splice(index, 1);
    this.dataSelectorService.replaceSelectedAdministration(this.administrationType, this.administrations);
    this.hasAdministration = this.administrations?.length > 0;
  }

}
