import { Component, Input } from '@angular/core';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorExportComponent } from '../indicator-export/indicator-export.component';
import { AdministrationInfo, IndicatorGroup } from '../indicator-list/indicator-list.component';

@Component({
  selector: 'app-indicator-doc-struct-list',
  templateUrl: './indicator-doc-struct-list.component.html',
  styleUrls: ['./indicator-doc-struct-list.component.scss']
})
export class IndicatorDocStructListComponent {

  @Input() docStructIndicators: Map<string, Map<number, IndicatorGroup>>;
  @Input() dateUsed: string[];
  @Input() isKeyFigure: boolean;

  docStructIdUsed: number[] = [];

  oldSelectionFilter: string;
  selectionFilter: string;
  private docStructIndicatorsFiltered: AdministrationInfo[];
  private docStructList: AdministrationInfo[] = [];

  aggregationType = AggregationType;
  indicatorExportComponent = IndicatorExportComponent;

  constructor(
    private indicatorsService: IndicatorsService
  ) { }

  get filterDocStructList(): AdministrationInfo[] {
    if (this.selectionFilter == null) {
      return this.docStructList;
    } else {
      this.oldSelectionFilter = this.selectionFilter;

      const filterDocStruct = [];
      for (const docStruct of this.docStructList) {
        if (docStruct.useName.toLowerCase().includes(this.selectionFilter.toLocaleLowerCase())) {
          filterDocStruct.push(docStruct);
        }
      }

      this.docStructIndicatorsFiltered = filterDocStruct;
      return filterDocStruct;
    }
  }

  getDocStructUseNameById(id: number): string {
    return this.docStructList.find((el) => el.id === id)?.useName;
  }

  fillDocStructList(docStructIndicator: Map<number, IndicatorGroup>) {
    const docStructs: AdministrationInfo[] = [];

    for (const [id, indicator] of docStructIndicator) {
      docStructs.push({ id, useName: indicator.key });
    }

    for (const docStruct of docStructs) {
      if (this.docStructList.find(el => el.id === docStruct.id) != null) {
        continue;
      }

      this.docStructList.push(docStruct);
    }

    this.docStructList = this.docStructList.sort((a, b) => a.useName.localeCompare(b.useName));
  }

  addDocStructId(id: number) {
    if (this.docStructIdUsed.indexOf(id) === -1) {
      this.docStructIdUsed.push(id);
    }
  }

  addDocStructIndicator(indicator: Indicators, year: string) {
    for (const resultIndicator of indicator.result.byDocStruct[year]) {

      let value = resultIndicator.result;

      if (value == null) {
        value = '';
      }

      const indicatorChartValue = {
        name: indicator.name,
        description: indicator.description,
        value,
        prefix: indicator.prefix,
        suffix: indicator.suffix,
        year,
        key: resultIndicator.useName
      };

      if (this.docStructIndicators.get(year).has(resultIndicator.id)) {
        this.docStructIndicators.get(year).get(resultIndicator.id).indicators.push(indicatorChartValue);
      } else {
        const docStructIndicator: IndicatorGroup = {
          key: resultIndicator.useName,
          indicators: [indicatorChartValue]
        };

        this.docStructIndicators.get(year).set(resultIndicator.id, docStructIndicator);
      }
    }
  }

  /**
   * Delete indicators or the given year
   * @param year
   */
  deleteDocStructIndicator(year: string) {
    this.docStructIndicators.delete(year);
    this.docStructList.splice(0, this.docStructList.length);
  }

  hasHiddenCard(): boolean {
    return this.indicatorsService.hasHiddenCard(this.isKeyFigure, AggregationType.byDocStruct);
  }

  resetHiddenCard() {
    this.indicatorsService.resetHiddenIndicatorInList(this.isKeyFigure, AggregationType.byDocStruct);
  }
}
