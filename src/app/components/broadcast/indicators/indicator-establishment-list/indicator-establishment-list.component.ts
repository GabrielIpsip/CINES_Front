import { Component, Input } from '@angular/core';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorExportComponent } from '../indicator-export/indicator-export.component';
import { AdministrationInfo, IndicatorGroup } from '../indicator-list/indicator-list.component';

@Component({
  selector: 'app-indicator-establishment-list',
  templateUrl: './indicator-establishment-list.component.html',
  styleUrls: ['./indicator-establishment-list.component.scss']
})
export class IndicatorEstablishmentListComponent {

  @Input() establishmentIndicators: Map<string, Map<number, IndicatorGroup>>;
  @Input() dateUsed: string[];
  @Input() isKeyFigure: boolean;

  establishmentIdUsed: number[] = [];

  oldSelectionFilter: string;
  selectionFilter: string;
  private establishmentIndicatorsFiltered: AdministrationInfo[];
  private establishmentList: AdministrationInfo[] = [];

  aggregationType = AggregationType;
  indicatorExportComponent = IndicatorExportComponent;

  constructor(
    private indicatorsService: IndicatorsService
  ) { }

  get filterEstablishmentList(): AdministrationInfo[] {
    if (this.selectionFilter == null) {
      return this.establishmentList;
    } else {
      this.oldSelectionFilter = this.selectionFilter;

      const filterEstablishment = [];
      for (const establishment of this.establishmentList) {
        if (establishment.useName.toLowerCase().includes(this.selectionFilter.toLocaleLowerCase())) {
          filterEstablishment.push(establishment);
        }
      }

      this.establishmentIndicatorsFiltered = filterEstablishment;
      return filterEstablishment;
    }
  }

  getEstablishmentUseNameById(id: number): string {
    return this.establishmentList.find((el) => el.id === id)?.useName;
  }

  fillEstablishmentList(establishmentIndicator: Map<number, IndicatorGroup>) {
    const establishments: AdministrationInfo[] = [];

    for (const [id, indicator] of establishmentIndicator) {
      establishments.push({ id, useName: indicator.key });
    }

    for (const establishment of establishments) {
      if (this.establishmentList.find(el => el.id === establishment.id) != null) {
        continue;
      }

      this.establishmentList.push(establishment);
    }

    this.establishmentList = this.establishmentList.sort((a, b) => a.useName.localeCompare(b.useName));

  }

  addEstablishmentId(id: number) {
    if (this.establishmentIdUsed.indexOf(id) === -1) {
      this.establishmentIdUsed.push(id);
    }
  }

  addEstablishmentIndicator(indicator: Indicators, year: string) {
    for (const resultIndicator of indicator.result.byEstablishment[year]) {

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

      if (this.establishmentIndicators.get(year).has(resultIndicator.id)) {
        this.establishmentIndicators.get(year).get(resultIndicator.id).indicators.push(indicatorChartValue);
      } else {
        const establishmentIndicator: IndicatorGroup = {
          key: resultIndicator.useName,
          indicators: [indicatorChartValue]
        };

        this.establishmentIndicators.get(year).set(resultIndicator.id, establishmentIndicator);
      }
    }
  }

  deleteEstablishmentIndicator(year: string) {
    this.establishmentIndicators.delete(year);
    this.establishmentList.splice(0, this.establishmentList.length);
  }

  hasHiddenCard(): boolean {
    return this.indicatorsService.hasHiddenCard(this.isKeyFigure, AggregationType.byEstablishment);
  }

  resetHiddenCard() {
    this.indicatorsService.resetHiddenIndicatorInList(this.isKeyFigure, AggregationType.byEstablishment);
  }
}
