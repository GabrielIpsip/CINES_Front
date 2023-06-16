import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

@Component({
  selector: 'app-data-selector-institution-search-list',
  templateUrl: './data-selector-institution-search-list.component.html',
  styleUrls: ['./data-selector-institution-search-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataSelectorInstitutionSearchListComponent implements OnInit, OnChanges {

  @Input() institutionList: BroadcastInstitution[];

  columnsToDisplay = ['id', 'year', 'useName', 'address', 'city', 'postalCode', 'add'];
  dataSource: MatTableDataSource<BroadcastInstitution>;
  expandedElement: BroadcastInstitution | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private translate: TranslateService,
    public dataSelectorService: DataSelectorService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.dataSource = new MatTableDataSource(this.institutionList);
  }

  ngOnChanges() {
    if (this.institutionList == null || this.dataSource == null) {
      return;
    }

    if (this.paginator.length !== this.dataSelectorService.institutionCountPaginator) {
      this.paginator.firstPage();
    }

    this.dataSource.data = this.institutionList;
    this.paginator.length = this.dataSelectorService.institutionCountPaginator;
  }

  addToSelectedAdministration(institution: BroadcastInstitution) {
    if (this.dataSelectorService.addSelectedAdministration(AdministrationTypesEnum.ESTABLISHMENT, institution)) {
      this.translate.stream('broadcast.infoAddEstablishmentSelectionMessage').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
    } else {
      this.translate.stream('error.alreadyInSelection').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
    }
  }

  onChangePage(event: PageEvent) {
    if (this.dataSelectorService.institutionIndexPaginatorSubject.value !== event.pageIndex) {
      this.dataSelectorService.institutionIndexPaginatorSubject.next(event.pageIndex);
    }

    if (this.dataSelectorService.institutionSizePaginatorSubject.value !== event.pageSize) {
      this.dataSelectorService.institutionSizePaginatorSubject.next(event.pageSize);
    }
  }

}
