import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';

export interface IndicatorChartValue {
  name: string;
  description: string;
  value: number;
  prefix: string;
  suffix: string;
}

@Component({
  selector: 'app-indicator-card-chart',
  templateUrl: './indicator-card-chart.component.html',
  styleUrls: ['./indicator-card-chart.component.scss']
})
export class IndicatorCardChartComponent {

  @Input() indicators: IndicatorChartValue[];
  @Input() keyFigure: boolean;
  @Input() aggregationType: AggregationType;

  constructor(
    private translate: TranslateService,
    private indicatorsService: IndicatorsService
  ) { }

  formatNumber(indicator: IndicatorChartValue): string {
    let value = indicator.value;

    if (value == null || value.toString().length === 0) {
      return '---';
    }

    let params = {};
    if (this.keyFigure) {
      value = Math.round(value);
    } else {
      params = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    }

    let formattedValue = value.toLocaleString(this.translate.getDefaultLang(), params);

    if (indicator.prefix != null) {
      formattedValue = indicator.prefix + ' ' + formattedValue;
    }

    if (indicator.suffix != null) {
      formattedValue += ' ' + indicator.suffix;
    }

    return formattedValue;
  }


  getColor(index: number): string {
    const colors = ['#5AA454', '#E44D25', '#CFC0BB', '#7aa3e5', '#a8385d',
      '#aae3f5', '#8054A4', '#A49F54', '#A4549D', '#90A454'];

    return colors[index % 10];
  }

  hideCard(index: number) {
    this.indicatorsService.hideIndicatorInList(index, this.keyFigure, this.aggregationType);
  }

  isHiddenCard(index: number): boolean {
    return this.indicatorsService.isHideIndicatorInList(index, this.keyFigure, this.aggregationType);
  }

}
