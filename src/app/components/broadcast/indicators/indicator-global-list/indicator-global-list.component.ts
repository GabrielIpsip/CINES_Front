import { Component, Input } from '@angular/core';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorChartValue } from '../indicator-card-chart/indicator-card-chart.component';
import { IndicatorExportComponent } from '../indicator-export/indicator-export.component';
import { IndicatorGroup } from '../indicator-list/indicator-list.component';

@Component({
  selector: 'app-indicator-global-list',
  templateUrl: './indicator-global-list.component.html',
  styleUrls: ['./indicator-global-list.component.scss']
})
export class IndicatorGlobalListComponent {

  @Input() dateUsed: string[];
  @Input() globalIndicators: Map<string, IndicatorChartValue[]>;
  @Input() isKeyFigure: boolean;

  aggregationType = AggregationType;
  indicatorExportComponent = IndicatorExportComponent;

  constructor(
    private indicatorsService: IndicatorsService
  ) { }

  get formattedIndicatorsForExport(): Map<string, Map<string, IndicatorGroup>> {
    const map = new Map<string, Map<string, IndicatorGroup>>();

    for (const [year, indicators] of this.globalIndicators) {

      const indicatorGroup: IndicatorGroup = {
        key: '',
        indicators: []
      };

      for (const indicator of indicators) {
        indicatorGroup.indicators.push(indicator);
      }

      if (!map.has(year)) {
        map.set(year, new Map<string, IndicatorGroup>());
      }

      map.get(year).set('', indicatorGroup);
    }

    return map;
  }

  addGlobalIndicator(indicator: Indicators, year: string) {
    let value = indicator.result.global[year];

    if (value == null) {
      value = 0;
    }

    const keyFigureIndicator: IndicatorChartValue = {
      name: indicator.name,
      description: indicator.description,
      value,
      prefix: indicator.prefix,
      suffix: indicator.suffix
    };

    this.globalIndicators.get(year).push(keyFigureIndicator);
  }

  hasHiddenCard(): boolean {
    return this.indicatorsService.hasHiddenCard(this.isKeyFigure, AggregationType.global);
  }

  resetHiddenCard() {
    this.indicatorsService.resetHiddenIndicatorInList(this.isKeyFigure, AggregationType.global);
  }
}
