import { Component, Input, OnChanges } from '@angular/core';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataTypeFlatNode } from '../../data-selector-types-tree/data-selector-types-tree.component';
import { ChartsParam } from '../charts-selector/charts-selector.component';

interface ChartData2D {
  name: string;
  value: any;
}

interface ChartData3D {
  name: string;
  series: [ChartData2D?];
}

export enum Dimension {
  value = 1,
  year = 2,
  administration = 3,
  variable = 4
}

@Component({
  selector: 'app-charts-visualization',
  templateUrl: './charts-visualization.component.html',
  styleUrls: ['./charts-visualization.component.scss']
})
export class ChartsVisualizationComponent implements OnChanges {

  @Input() selectedChart: [string, ChartsParam];
  @Input() selectedAdministration: BroadcastAdministration[];
  @Input() selectedVariable: string[];
  @Input() dataTypes: Map<string, DataTypeFlatNode>;

  availableScheme = ['vivid', 'natural', 'cool', 'fire', 'solar', 'air', 'aqua', 'flame', 'ocean', 'forest', 'horizon',
    'neons', 'picnic', 'night', 'nightLights'];

  availableLegendPosition = ['right', 'below'];

  data: any;

  scheme = 'cool';
  legendPosition = 'right';
  showDataLabel = false;
  roundDomains = false;
  showXAxis = true;
  showYAxis = true;
  showZAxis = true;
  gradient = false;
  showXAxisLabel = true;
  showYAxisLabel = true;
  showZAxisLabel = true;
  xAxisLabel = '';
  yAxisLabel = '';
  zAxisLabel = '';

  is3D: boolean;

  ngOnChanges() {
    if (this.selectedAdministration == null || this.selectedAdministration.length === 0) {
      return;
    }

    const X: Dimension = this.selectedChart[1].dimensions.X;
    const Y: Dimension = this.selectedChart[1].dimensions.Y;
    const Z: Dimension = this.selectedChart[1].dimensions.Z;

    if (Z == null) {
      this.is3D = false;
      this.xAxisLabel = this.getAxisLabel(X);
      this.yAxisLabel = this.getAxisLabel(Y);
      this.data = this.convertTo2DData(this.getValues(X), this.getValues(Y));
    } else {
      this.is3D = true;
      this.xAxisLabel = this.getAxisLabel(X);
      this.yAxisLabel = this.getAxisLabel(Z);
      this.zAxisLabel = this.getAxisLabel(Y);
      this.data = this.convertTo3DData(this.getValues(X), this.getValues(Y), this.getValues(Z));
    }
  }

  reloadViewSize() {
    window.dispatchEvent(new Event('resize'));
  }

  private getValues(dimension: Dimension) {
    const data = [];
    for (const administration of this.selectedAdministration) {
      for (const variable of this.selectedVariable) {
        data.push(this.getData(dimension, administration, variable));
      }
    }
    return data;
  }

  private getData(dimension: Dimension, administration: BroadcastAdministration, variable: string) {
    switch (dimension) {
      case Dimension.administration:
        return administration.useName;
      case Dimension.year:
        return administration.year;
      case Dimension.variable:
        return this.getVariableLabel(variable);
      case Dimension.value:
        if (administration.hasOwnProperty(variable) && administration[variable] != null) {
          return administration[variable];
        } else {
          return 0;
        }
    }
  }

  private getAxisLabel(dimension: Dimension): string {
    switch (dimension) {
      case Dimension.administration:
        return 'broadcast.chart.administrations';
      case Dimension.year:
        return 'broadcast.chart.years';
      case Dimension.variable:
        return 'broadcast.chart.variables';
      case Dimension.value:
        if (this.selectedChart[1].multipleVariableSelector) {
          return '';
        }
        else {
          return this.getVariableLabel(this.selectedVariable[0]);
        }
    }
  }

  private getVariableLabel(code: string) {
    const dataType = this.dataTypes.get(code);
    if (dataType.measureUnit?.length > 0) {
      return dataType.name + ' (' + dataType.measureUnit + ')';
    } else {
      return dataType.name;
    }
  }

  private convertTo2DData(XData: any[], YData: any[]): ChartData2D[] {
    const data: ChartData2D[] = [];
    for (let i = 0; i < XData.length; i++) {
      const value: ChartData2D = {
        value: XData[i],
        name: YData[i]
      };
      data.push(value);
    }
    return data;
  }

  private convertTo3DData(XData: any[], YData: any[], ZData: any[]): ChartData3D[] {
    const data: ChartData3D[] = [];
    for (let i = 0; i < ZData.length; i++) {
      let value = data.find(el => el.name === ZData[i]);
      if (value == null) {
        value = {
          name: ZData[i],
          series: []
        };
        data.push(value);
      }
      value.series.push({ value: XData[i], name: YData[i] });
    }
    return data;
  }

}
