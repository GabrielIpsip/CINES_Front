import { Component, OnInit, OnDestroy, ViewChild, Input } from '@angular/core';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Establishments } from 'src/app/models/establishments.model';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { trigger, style, state, transition, animate } from '@angular/animations';
import { Surveys } from 'src/app/models/surveys.model';
import { DataValuesService } from 'src/app/services/data-values.service';

@Component({
  selector: 'app-establishment-search-list',
  templateUrl: './establishment-search-list.component.html',
  styleUrls: ['./establishment-search-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class EstablishmentSearchListComponent implements OnInit, OnDestroy {

  @Input() progressMode: boolean;
  @Input() totalProgressMode: boolean;
  @Input() survey: Surveys;

  searchResult: Observable<Establishments[]>;
  hasSearch: Observable<boolean>;

  columnsToDisplay: string[];
  dataSource: MatTableDataSource<Establishments>;
  expandedElement: Establishments | null;

  progress: boolean;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private establishmentsService: EstablishmentsService,
    public loaderService: LoaderService,
    private translate: TranslateService,
    private dataValuesService: DataValuesService
  ) { }

  ngOnInit() {
    this.columnsToDisplay = ['id', 'useName', 'city', 'active'];
    this.progress = this.progressMode || this.totalProgressMode;

    if (this.progress) {
      this.columnsToDisplay.pop();
    }
    if (this.progressMode) {
      this.columnsToDisplay.push('progress');
    }
    if (this.totalProgressMode) {
      this.columnsToDisplay.push('totalProgress');
    }

    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);


    this.subscribeResultList();
    this.hasSearch = this.establishmentsService.getHasSearch(this.progress);
    this.establishmentsService.setSaveResultList(this.progress);
  }

  ngOnDestroy() {
    this.establishmentsService.saveResultList(this.progress);
    this.establishmentsService.cleanEstablishmentList(this.progress);
    this.establishmentsService.updateHasSearch(false, this.progress);
  }

  subscribeResultList() {
    this.establishmentsService.getEstablishmentList(this.progress).subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  onClickReplyButton(establishment: Establishments) {
    this.dataValuesService.setAdministration(new Establishments(establishment));
    this.dataValuesService.setSurvey(this.survey);
  }

}
