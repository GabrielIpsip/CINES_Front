import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-indicator-update-list',
  templateUrl: './indicator-update-list.component.html',
  styleUrls: ['./indicator-update-list.component.scss']
})
export class IndicatorUpdateListComponent implements OnInit {

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  displayedColumns: string[] =
    ['displayOrder', 'name', 'keyFigure', 'administrator', 'global', 'byRegion', 'byEstablishment', 'byDocStruct',
      'active'];
  dataSource: MatTableDataSource<Indicators>;

  createRoute = '/indicators/create';

  constructor(
    private indicatorsService: IndicatorsService,
    private translate: TranslateService,
    private rightsChecker: RightsCheckerService
  ) { }

  get canCreate(): boolean {
    return this.rightsChecker.disabled(this.createRoute);
  }

  ngOnInit() {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.indicatorsService.getAllIndicators(null, false, false).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource<Indicators>(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
