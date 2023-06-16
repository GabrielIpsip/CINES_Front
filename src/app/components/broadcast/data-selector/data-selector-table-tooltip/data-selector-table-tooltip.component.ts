import { Component } from '@angular/core';
import { ITooltipAngularComp } from 'ag-grid-angular';
import { ITooltipParams, IAfterGuiAttachedParams } from 'ag-grid-community';
import { TypesEnum } from 'src/app/common/typesEnum.enum';

export interface DataSelectorTableToolTipParam {
  measureUnit: string;
  type: TypesEnum;
  locale: string;
  decimal: boolean;
}

@Component({
  selector: 'app-data-selector-table-tooltip',
  templateUrl: './data-selector-table-tooltip.component.html',
  styleUrls: ['./data-selector-table-tooltip.component.scss']
})
export class DataSelectorTableTooltipComponent implements ITooltipAngularComp {

  message: string;

  agInit(params: ITooltipParams | any) {
    if (params.location === 'cell') {
      switch (params.type) {
        case TypesEnum.text:
          this.message = params.data[params.column.colId];
          break;
        case TypesEnum.number:
        case TypesEnum.operation:
          this.message = params.measureUnit;
          break;
      }
    }

    else if (params.location === 'header') {
      this.message = params.colDef.headerName;
    }
  }

  afterGuiAttached?(params?: IAfterGuiAttachedParams) { }

}
