import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

@Component({
  selector: 'app-charts-administration-selector',
  templateUrl: './charts-administration-selector.component.html',
  styleUrls: ['./charts-administration-selector.component.scss']
})
export class ChartsAdministrationSelectorComponent implements OnChanges {

  @Input() multiple: boolean;
  @Input() selectedYear: string[];

  @Output() selectedAdministration = new EventEmitter<BroadcastAdministration[]>();

  administrationTypeEnum = AdministrationTypesEnum;
  administrationType: AdministrationTypesEnum;

  storedAdministrations: BroadcastAdministration[] = [];
  administrationsToShow: BroadcastAdministration[] = [];

  constructor(
    private dataSelectorService: DataSelectorService
  ) { }

  ngOnChanges() {
    this.updateAdministration();
  }

  updateAdministration() {
    this.administrationsToShow = [];
    this.selectedAdministration.emit(null);
    this.dataSelectorService.getStoredValidateSelection(this.administrationType).then((value) => {
      this.storedAdministrations = value;

      if (!this.storedAdministrations || this.storedAdministrations == null) {
        return;
      }
      for (const administration of this.storedAdministrations) {
        if (this.selectedYear.includes(administration.year.toString())) {
          if (!this.alreadyAddedAdministration(administration.id)) {
            this.administrationsToShow.push(administration);
          }
        }
      }
    });
  }

  onChangeAdministration(formInfo: any) {
    let value: BroadcastAdministration[] = formInfo.value;
    if (!Array.isArray(formInfo.value)) {
      value = [formInfo.value];
    }
    const administrationsSelected: BroadcastAdministration[] = [];
    for (const storedAdministration of this.storedAdministrations) {
      if (this.selectedYear.includes(storedAdministration.year.toString())
        && value.find((el) => el.id === storedAdministration.id)) {
        administrationsSelected.push(storedAdministration);
      }
    }
    this.selectedAdministration.emit(administrationsSelected);
  }

  returnZero(): number {
    return 0;
  }

  private alreadyAddedAdministration(id: number) {
    for (const administration of this.administrationsToShow) {
      if (administration.id === id) {
        return true;
      }
    }
    return false;
  }

}
