import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

@Component({
  selector: 'app-charts-year-selector',
  templateUrl: './charts-year-selector.component.html',
  styleUrls: ['./charts-year-selector.component.scss']
})
export class ChartsYearSelectorComponent implements OnInit {

  @Input() multiple: boolean;
  @Output() selectedYear = new EventEmitter<string[]>();

  years: string[] = [];

  yearFormValue: string[] | string;

  constructor(
    private dataSelectorService: DataSelectorService
  ) { }

  ngOnInit() {
    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.ESTABLISHMENT)
      .then((establishements) => {
        this.addYear(establishements);
      });

    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.DOC_STRUCT)
      .then((docStructs) => {
        this.addYear(docStructs);
      });

    this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.PHYSIC_LIB)
      .then((physicLibs) => {
        this.addYear(physicLibs);
      });

  }

  private addYear(administrations: BroadcastAdministration[]) {
    if (!administrations || administrations == null) {
      return;
    }
    for (const administration of administrations) {
      const year = administration.year.toString();
      if (!this.years.includes(year)) {
        this.years.push(year);
      }
    }
  }

  onChangeValue(formInfo: any) {
    let value = formInfo.value;
    if (!Array.isArray(formInfo.value)) {
      value = [value];
    }
    this.selectedYear.emit(value);
  }

}
