import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { indexOf } from 'lodash';
import { BroadcastInstitutionsService } from 'src/app/services/broadcast/broadcast-institutions.service';
import { IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { LoaderService } from 'src/app/services/loader.service';
import { IndicatorChartValue } from '../indicator-card-chart/indicator-card-chart.component';
import { IndicatorDocStructListComponent } from '../indicator-doc-struct-list/indicator-doc-struct-list.component';
import { IndicatorEstablishmentListComponent } from '../indicator-establishment-list/indicator-establishment-list.component';
import { IndicatorGlobalListComponent } from '../indicator-global-list/indicator-global-list.component';
import { IndicatorRegionListComponent } from '../indicator-region-list/indicator-region-list.component';

export interface AdministrationInfo {
  id: number;
  useName: string;
}

export interface IndicatorGroup {
  key: string;
  indicators: IndicatorChartValue[];
}

@Component({
  selector: 'app-indicator-list',
  templateUrl: './indicator-list.component.html',
  styleUrls: ['./indicator-list.component.scss']
})
export class IndicatorListComponent implements OnInit {

  iskeyFigureRoute = true;

  dateList: string[];
  dateUsed: string[];

  globalIndicators = new Map<string, IndicatorChartValue[]>();
  regionIndicators = new Map<string, Map<string, IndicatorGroup>>();
  establishmentIndicators = new Map<string, Map<number, IndicatorGroup>>();
  docStructIndicators = new Map<string, Map<number, IndicatorGroup>>();

  @ViewChild('keyFigureIndicatorList') keyFigureIndicatorListComponent: IndicatorGlobalListComponent;
  @ViewChild('regionIndicatorList') regionIndicatorListComponent: IndicatorRegionListComponent;
  @ViewChild('establishmentIndicatorList') establishmentIndicatorListComponent: IndicatorEstablishmentListComponent;
  @ViewChild('docStructIndicatorList') docStructIndicatorListComponent: IndicatorDocStructListComponent;

  constructor(
    private indicatorsService: IndicatorsService,
    private institutionService: BroadcastInstitutionsService,
    private loaderService: LoaderService,
    private router: Router
  ) {
    this.iskeyFigureRoute = this.router.url === '/broadcast/key-figures';
  }

  ngOnInit() {
    this.institutionService.getAllYears().subscribe({
      next: (response) => {
        this.dateList = this.institutionService
          .getAggregationsKey(response, this.institutionService.YEARS_AGGS_NAME)
          .sort()
          .reverse();

        this.updateDateUsed([this.dateList[0]]);
      }
    });
  }

  updateDateUsed(years: string[]) {
    this.dateUsed = years;

    this.globalIndicators.forEach((value: IndicatorChartValue[], key: string) =>
      {
        if (years.indexOf(key) === -1) {
          this.docStructIndicatorListComponent.deleteDocStructIndicator(key);
          this.establishmentIndicatorListComponent.deleteEstablishmentIndicator(key);

        }
        this.globalIndicators.delete(key);

    });

    if (years.length === 0) {
      console.log("Array is empty");
      // Recherche
    }
    for (const year of years) {

      if (this.globalIndicators.has(year)) {
        continue;
      }

      this.loaderService.show(true);
      this.indicatorsService.getAllIndicators(year, true, false).subscribe({
        next: (response) => {
          this.globalIndicators.set(year, []);
          this.regionIndicators.set(year, new Map<string, IndicatorGroup>());
          this.establishmentIndicators.set(year, new Map<number, IndicatorGroup>());
          this.docStructIndicators.set(year, new Map<number, IndicatorGroup>());

          for (const indicator of response) {
            if (this.iskeyFigureRoute !== indicator.keyFigure) {
              continue;
            }

            if (indicator.global && indicator.result.global != null) {
              this.keyFigureIndicatorListComponent.addGlobalIndicator(indicator, year);
            }

            if (indicator.byRegion && indicator.result.byRegion != null) {
              this.regionIndicatorListComponent.addRegionIndicator(indicator, year);
            }

            if (indicator.byEstablishment && indicator.result.byEstablishment != null) {
              this.establishmentIndicatorListComponent.addEstablishmentIndicator(indicator, year);
            }

            if (indicator.byDocStruct && indicator.result.byDocStruct != null) {
              this.docStructIndicatorListComponent.addDocStructIndicator(indicator, year);
            }
          }

          this.regionIndicatorListComponent.fillRegionList(this.regionIndicators.get(year));
          this.establishmentIndicatorListComponent.fillEstablishmentList(this.establishmentIndicators.get(year));
          this.docStructIndicatorListComponent.fillDocStructList(this.docStructIndicators.get(year));

          this.loaderService.hide(true);
        },
        error: () => this.loaderService.hide(true)
      });
    }
  }

  isAYearDeselected(years: string[]) {
    this.globalIndicators.forEach((value: IndicatorChartValue[], key: string) => {if (years.indexOf(key) === -1) return false;})
    return true;
  }


}
