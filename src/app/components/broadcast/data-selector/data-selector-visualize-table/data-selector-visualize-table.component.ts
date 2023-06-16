import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AgGridAngular } from 'ag-grid-angular';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { DataSelectorTableTooltipComponent, DataSelectorTableToolTipParam } from '../data-selector-table-tooltip/data-selector-table-tooltip.component';
import { DataTypeFlatNode } from '../data-selector-types-tree/data-selector-types-tree.component';


enum OperationEnum {
  sum = 'sum',
  avg = 'avg',
  min = 'min',
  max = 'max',
  median = 'median'
}

interface AgGridColumn {
  field: string;
  headerName: string;
  pinned?: string;
  maxWidth?: number;
  minWidth?: number;
  width?: number;
  resizable?: boolean;
  tooltipField?: string;
  tooltipComponentParams?: DataSelectorTableToolTipParam;
  valueFormatter?: any;
  cellRenderer?: any;
  cellStyle?: any;
  headerTooltip?: string;
}

@Component({
  selector: 'app-data-selector-visualize-table',
  templateUrl: './data-selector-visualize-table.component.html',
  styleUrls: ['./data-selector-visualize-table.component.scss']
})
export class DataSelectorVisualizeTableComponent implements OnInit {

  @Input() administrations: BroadcastAdministration[];
  @Input() dataTypes: DataTypeFlatNode[];
  @Input() administrationType: AdministrationTypesEnum;

  @ViewChild('topGrid') topGrid: AgGridAngular;
  @ViewChild('bottomGrid') bottomGrid: AgGridAngular;

  frameworkComponents = { dataSelectorTableTooltipComponent: DataSelectorTableTooltipComponent };

  columnsToDisplay: AgGridColumn[] = [{
    field: 'year',
    headerName: this.translate.instant('establishment.view.year'),
    headerTooltip: 'year',
    pinned: 'left',
    width: 75,
    minWidth: 75,
    resizable: true
  },
  {
    field: 'useName',
    headerName: this.translate.instant('establishment.view.useName'),
    headerTooltip: 'useName',
    pinned: 'left',
    width: 150,
    minWidth: 200,
    resizable: true
  }];

  operationEnum = OperationEnum;
  selectedOperation: OperationEnum = OperationEnum.sum;

  dataTypeColumns = [];
  dataTypeNames = new Map<string, DataTypeFlatNode>();
  dataTypeOperationResult: any;

  topOptions = {
    alignedGrids: [],
    defaultColDef: {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1,
      tooltipComponent: 'dataSelectorTableTooltipComponent'
    },
    suppressHorizontalScroll: true,
    tooltipShowDelay: 0,
  };

  bottomOptions = {
    alignedGrids: [],
    defaultColDef: {
      editable: true,
      sortable: true,
      resizable: true,
      filter: true,
      flex: 1
    }
  };

  constructor(
    private translate: TranslateService
  ) { }

  get locale(): string {
    return this.translate.getDefaultLang();
  }

  get height(): number {
    const nbCell = this.administrations.length;
    const height = 42 * nbCell + 51;
    const maxHeight = document.documentElement.clientHeight * 0.50;
    if (height > maxHeight) {
      return maxHeight;
    } else {
      return height;
    }
  }

  ngOnInit() {
    this.sortAdministrationsToDefault();
    const numberDataTypeId: number[] = [];

    for (const dataType of this.dataTypes) {
      this.dataTypeNames.set(dataType.code, dataType);

      this.columnsToDisplay.push({
        field: dataType.code,
        headerName: this.dataTypeNames.get(dataType.code).name,
        headerTooltip: dataType.code,
        width: 150,
        minWidth: 150,
        tooltipField: dataType.code,
        tooltipComponentParams: {
          measureUnit: dataType.measureUnit,
          type: dataType.type,
          locale: this.locale,
          decimal: dataType.decimal
        },
        cellRenderer: this.formatValue,
        cellStyle: this.getCellStyle
      });

      this.dataTypeColumns.push(dataType.code);
      if (dataType.type === TypesEnum.number && dataType.id !== 0) {
        numberDataTypeId.push(dataType.id);
      }
    }

    this.computeOperation();
    this.topOptions.alignedGrids.push(this.bottomOptions);
    this.bottomOptions.alignedGrids.push(this.topOptions);
  }

  private formatValue(params: any): string {
    const type: TypesEnum = params.colDef.tooltipComponentParams.type;
    const locale: TypesEnum = params.colDef.tooltipComponentParams.locale;
    const decimal: boolean = params.colDef.tooltipComponentParams.decimal;
    const value: any = params.value;

    if (value == null) {
      return value;
    }

    switch (type) {
      case TypesEnum.number:
        if (decimal) {
          return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        }
        return value.toLocaleString(locale);
      case TypesEnum.operation:
        return value.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      case TypesEnum.boolean:
        if (value === true) {
          return '<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">check_box</mat-icon>';
        } else if (value === false) {
          return '<mat-icon class="mat-icon material-icons mat-icon-no-color" role="img" aria-hidden="true">check_box_outline_blank</mat-icon>';
        } else {
          return value;
        }
      case TypesEnum.text:
        return params.data[params.column.colId];
    }
  }

  private getCellStyle(params: any): any {
    const type: TypesEnum = params.colDef.tooltipComponentParams.type;
    if (type === TypesEnum.number || type === TypesEnum.operation) {
      return { textAlign: 'right' };
    }
    return {};
  }

  private sortAdministrationsToDefault() {
    switch (this.administrationType) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        this.administrations = this.administrations.sort(
          (a: BroadcastInstitution, b: BroadcastInstitution) => parseInt(a.year, 10) - parseInt(b.year, 10));
        break;
      case AdministrationTypesEnum.DOC_STRUCT:
        this.administrations = this.administrations.sort(
          (a: BroadcastDocumentaryStructure, b: BroadcastDocumentaryStructure) =>
            parseInt(a.year, 10) - parseInt(b.year, 10) || a.institutionsId - b.institutionsId);
        break;
      case AdministrationTypesEnum.PHYSIC_LIB:
        this.administrations = this.administrations.sort(
          (a: BroadcastPhysicalLibrary, b: BroadcastPhysicalLibrary) =>
            parseInt(a.year, 10) - parseInt(b.year, 10) || a.documentaryStructuresId - b.documentaryStructuresId);
        break;
    }
  }

  computeOperation() {
    this.dataTypeOperationResult = [{}];

    for (const dataType of this.dataTypes) {
      if (dataType.type === TypesEnum.text) {
        continue;
      }

      let result: number;

      switch (this.selectedOperation) {
        case OperationEnum.sum:
          if (dataType.type === TypesEnum.boolean) {
            result = this.getNbrTrue(dataType.code);
          } else {
            result = this.getSum(dataType.code);
          }
          break;
        case OperationEnum.avg:
          result = this.getAvg(dataType.code);
          break;
        case OperationEnum.max:
          result = this.getMax(dataType.code);
          break;
        case OperationEnum.min:
          result = this.getMin(dataType.code);
          break;
        case OperationEnum.median:
          result = this.getMedian(dataType.code);
      }

      if (result == null) {
        continue;
      }

      result = Math.round((result + Number.EPSILON) * 100) / 100;

      if (isNaN(result)) {
        continue;
      }

      if (dataType.type === TypesEnum.boolean) {
        if (this.selectedOperation === OperationEnum.sum) {
          this.dataTypeOperationResult[0][dataType.code] =
            result.toLocaleString(this.locale) + ' / ' + this.administrations.length;
        }

      } else {
        this.dataTypeOperationResult[0][dataType.code] = result
          .toLocaleString(this.locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
      }
    }

  }

  private getSum(column: string): number {
    return this.administrations.map(el => el[column]).reduce((acc, value) => {
      if (value != null) {
        return acc + value;
      } else {
        return acc;
      }
    }, 0);
  }

  private getAvg(column: string): number {
    return this.getSum(column) / this.administrations.filter(el => el[column] != null)?.length;
  }

  private getMax(column: string): number {
    return this.administrations.map(el => el[column] != null ? el[column] : null).reduce((a, b) => {
      if (a == null || isNaN(a)) {
        a = b;
      }

      if (b == null || isNaN(b)) {
        return a;
      } else {
        return Math.max(a, b);
      }
    });

  }

  private getMin(column: string): number {
    return this.administrations.map(el => el[column] != null ? el[column] : null).reduce((a, b) => {
      if (a == null || isNaN(a)) {
        a = b;
      }

      if (b == null || isNaN(b)) {
        return a;
      } else {
        return Math.min(a, b);
      }
    });
  }

  private getMedian(column: string): number {
    const values = this.administrations.map(el => el[column]).filter(el => el != null).sort((a, b) => a - b);

    if (values.length === 0) {
      return null;
    }

    const half = Math.floor(values.length / 2);

    if (values.length % 2 > 0) {
      return values[half];
    } else {
      return (values[half - 1] + values[half]) / 2;
    }
  }

  private getNbrTrue(column: string): number {
    return this.administrations.map(el => el[column]).reduce((acc, value) => {
      if (value) {
        return acc + 1;
      } else {
        return acc;
      }
    }, 0);
  }
}
