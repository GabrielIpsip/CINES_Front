import { Component, Input } from '@angular/core';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorExportComponent } from '../indicator-export/indicator-export.component';
import { IndicatorGroup } from '../indicator-list/indicator-list.component';

@Component({
  selector: 'app-indicator-region-list',
  templateUrl: './indicator-region-list.component.html',
  styleUrls: ['./indicator-region-list.component.scss']
})
export class IndicatorRegionListComponent {

  @Input() dateUsed: string[];
  @Input() regionIndicators: Map<string, Map<string, IndicatorGroup>>;
  @Input() isKeyFigure: boolean;

  regionUsed: string[] = [];
  regions: string[] = [];

  aggregationType = AggregationType;
  indicatorExportComponent = IndicatorExportComponent;

  constructor(
    private indicatorsService: IndicatorsService
  ) {}

  addRegionIndicator(indicator: Indicators, year: string) {
    for (const resultIndicator of indicator.result.byRegion[year]) {

      let value = resultIndicator.result;

      if (value == null) {
        value = '';
      }

      const indicatorChartValue = {
        name: indicator.name,
        description: indicator.description,
        value,
        prefix: indicator.prefix,
        suffix: indicator.suffix
      };

      if (this.regionIndicators.get(year).has(resultIndicator.region)) {
        this.regionIndicators.get(year).get(resultIndicator.region).indicators.push(indicatorChartValue);
      } else {
        const regionIndicator: IndicatorGroup = {
          key: resultIndicator.region,
          indicators: [indicatorChartValue]
        };

        this.regionIndicators.get(year).set(resultIndicator.region, regionIndicator);
      }
    }
  }

  fillRegionList(regionIndicator: Map<string, IndicatorGroup>) {
    const regions: string[] = [];

    for (const [, indicator] of regionIndicator) {
      regions.push(indicator.key);
    }

    this.regions = regions.filter((el, index, self) => {
      return index === self.indexOf(el);
    }).sort((a, b) => a.localeCompare(b));

  }

  hasHiddenCard(): boolean {
    return this.indicatorsService.hasHiddenCard(this.isKeyFigure, AggregationType.byRegion);
  }

  resetHiddenCard() {
    this.indicatorsService.resetHiddenIndicatorInList(this.isKeyFigure, AggregationType.byRegion);
  }

}
