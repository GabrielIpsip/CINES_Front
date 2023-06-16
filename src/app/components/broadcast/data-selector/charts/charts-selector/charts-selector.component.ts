import { Component, OnInit, ViewChild } from '@angular/core';
import { TooltipComponent } from '@angular/material/tooltip';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { DataTypeFlatNode } from '../../data-selector-types-tree/data-selector-types-tree.component';
import { Dimension } from '../charts-visualization/charts-visualization.component';
import { ChartsYearSelectorComponent } from '../charts-year-selector/charts-year-selector.component';

export interface ChartsParam {
  multipleYearSelector?: boolean;
  multipleAdministrationSelector?: boolean;
  multipleVariableSelector?: boolean;
  dimensions: {
    X: Dimension;
    Y: Dimension;
    Z?: Dimension;
  };
}

@Component({
  selector: 'app-charts-selector',
  templateUrl: './charts-selector.component.html',
  styleUrls: ['./charts-selector.component.scss']
})
export class ChartsSelectorComponent implements OnInit {

  @ViewChild('yearForm') yearForm: ChartsYearSelectorComponent;

  chartsAvailable = new Map<string, ChartsParam>();

  selectedChart: [string, ChartsParam];

  selectedYear: string[];
  selectedAdministration: BroadcastAdministration[];
  selectedVariable: string[];

  dataTypes = new Map<string, DataTypeFlatNode>();

  constructor(
    private dataSelectorService: DataSelectorService
  ) { }

  ngOnInit() {
    this.initDataType();

    this.chartsAvailable.set('horizontalBarChart',
      {
        multipleAdministrationSelector: true,
        dimensions: { X: Dimension.value, Y: Dimension.administration }
      });

    this.chartsAvailable.set('groupedHorizontalBarChart1',
      {
        multipleYearSelector: true, multipleAdministrationSelector: true,
        dimensions: { X: Dimension.value, Y: Dimension.year, Z: Dimension.administration }
      });

    this.chartsAvailable.set('groupedHorizontalBarChart2',
      {
        multipleYearSelector: true, multipleVariableSelector: true,
        dimensions: { X: Dimension.value, Y: Dimension.variable, Z: Dimension.year }
      });

    this.authorizeHtmlInMatToolTip();
  }

  onChangeSelectedChart(formInfo: any) {
    this.reset();
    const chartName: string = formInfo.value;
    this.selectedChart = [chartName, this.chartsAvailable.get(chartName)];
  }

  getChartImg(chartKey: string) {
    return '<img src="assets/img/' + chartKey + '.png" style="width: 520px; height: 275px;"/>';
  }

  private reset() {
    this.selectedChart = null;
    this.selectedYear = [];
    this.selectedAdministration = [];
    this.selectedVariable = [];
    if (this.yearForm != null) {
      this.yearForm.yearFormValue = null;
    }
  }

  private initDataType() {
    const establishmentDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.ESTABLISHMENT);
    const docStructDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.DOC_STRUCT);
    const physicLibDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.PHYSIC_LIB);

    for (const dataType of establishmentDataTypes) {
      this.dataTypes.set(dataType.code, dataType);
    }

    for (const dataType of docStructDataTypes) {
      this.dataTypes.set(dataType.code, dataType);
    }

    for (const dataType of physicLibDataTypes) {
      this.dataTypes.set(dataType.code, dataType);
    }
  }

  updateYearValue(selectedYear: string[]) {
    this.selectedVariable = [];
    this.selectedAdministration = [];
    this.selectedYear = selectedYear;
  }

  updateAdministrationValue(selectedAdministration: BroadcastAdministration[]) {
    this.selectedAdministration = selectedAdministration;
    if (selectedAdministration == null || selectedAdministration.length === 0) {
      this.selectedVariable = [];
    }
  }

  updateVariableValue(selectedVariable: string[]) {
    this.selectedVariable = selectedVariable;
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
