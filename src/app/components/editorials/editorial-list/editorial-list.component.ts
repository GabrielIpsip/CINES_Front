import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { Editorials } from 'src/app/models/editorials.model';
import { EditorialsService } from 'src/app/services/editorials.service';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-editorial-list',
  templateUrl: './editorial-list.component.html',
  styleUrls: ['./editorial-list.component.scss']
})
export class EditorialListComponent implements OnInit {

  columnsToDisplay = ['title', 'survey.name', 'survey.calendarYear', 'survey.dataCalendarYear'];
  dataSource: MatTableDataSource<Editorials>;
  expandedElement: Editorials | null;

  editorials: Editorials[];

  globalEditorial: string;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private editorialsService: EditorialsService,
    private translate: TranslateService,
    private routesService: RoutesService
  ) { }

  get globalEditorialRouteName() {
    return this.routesService.editorialRouteName;
  }

  ngOnInit() {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.editorialsService.getAllEditorials().subscribe({
      next: (response) => {
        this.editorials = response;
        this.formatDate();
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sortingDataAccessor = (item, property) => {
          if (property.startsWith('survey.')) {
            const propertySplit = property.split('.');
            return item[propertySplit[0]][propertySplit[1]];
          } else {
            return item[property];
          }
        };
      },
      error: (error) => {
        if (error.status === 404) { /* Do nothing */ }
      }
    });

    this.routesService.getRouteByName(this.globalEditorialRouteName, this.translate.getDefaultLang()).subscribe({
      next: (response) => {
        this.globalEditorial = JSON.parse(response.content)[0].content;
      }
    });
  }

  formatDate() {
    for (const editorial of this.editorials) {
      editorial.survey.dataCalendarYear = editorial.survey.dataCalendarYear.split('-')[0];
      editorial.survey.calendarYear = editorial.survey.calendarYear.split('-')[0];
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filterPredicate = (editorial: Editorials, filter: string): boolean => {
      filter = filter.trim().toLocaleLowerCase();
      return editorial.title?.toLocaleLowerCase().includes(filter)
        || editorial.survey.name.toLocaleLowerCase().includes(filter)
        || editorial.survey.dataCalendarYear.toLocaleLowerCase().includes(filter)
        || editorial.survey.calendarYear.toLocaleLowerCase().includes(filter);
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
