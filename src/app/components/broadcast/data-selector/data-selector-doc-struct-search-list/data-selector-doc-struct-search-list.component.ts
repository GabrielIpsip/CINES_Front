import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';

@Component({
  selector: 'app-data-selector-doc-struct-search-list',
  templateUrl: './data-selector-doc-struct-search-list.component.html',
  styleUrls: ['./data-selector-doc-struct-search-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed, void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class DataSelectorDocStructSearchListComponent implements OnInit, OnChanges {

  @Input() docStructList: BroadcastDocumentaryStructure[];

  buffer: BroadcastDocumentaryStructure[] = [];

  columnsToDisplay = ['id', 'year', 'useName', 'address', 'city', 'postalCode', 'add'];
  dataSource: MatTableDataSource<BroadcastDocumentaryStructure>;
  expandedElement: BroadcastDocumentaryStructure | null;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  constructor(
    private translate: TranslateService,
    public dataSelectorService: DataSelectorService,
    private snackBar: MatSnackBar
  ) { }

  private get currentIndexValue(): number {
    return this.dataSelectorService.docStructIndexPaginatorSubject.value;
  }

  private get currentSizeValue(): number {
    return this.dataSelectorService.docStructSizePaginatorSubject.value;
  }

  ngOnInit() {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.buffer = [...this.docStructList];
    this.dataSource = new MatTableDataSource(this.buffer.slice(0, 10));
  }

  ngOnChanges(): void {
    if (this.docStructList == null || this.dataSource == null) {
      return;
    }

    this.fillBuffer();
    this.updateDataSource();

    if (this.currentSizeValue !== this.paginator.pageSize) {
      this.buffer = [...this.docStructList];
    }

    if (this.paginator.length !== this.dataSelectorService.docStructCountPaginator || this.buffer.length === 0) {
      this.paginator.firstPage();
      this.paginator.length = this.dataSelectorService.docStructCountPaginator;
      this.buffer = [...this.docStructList];
      this.dataSource.data = this.buffer.slice(0, this.paginator.pageSize);
    }
  }

  addToSelectedAdministration(institution: BroadcastInstitution) {
    if (this.dataSelectorService.addSelectedAdministration(AdministrationTypesEnum.DOC_STRUCT, institution)) {
      this.translate.stream('broadcast.infoAddDocStructSelectionMessage').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
    } else {
      this.translate.stream('error.alreadyInSelection').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
    }
  }

  onChangePage(event: PageEvent) {
    if (this.currentIndexValue !== event.pageIndex) {
      this.dataSelectorService.docStructIndexPaginatorSubject.next(event.pageIndex);
    }

    if (this.currentSizeValue !== event.pageSize) {
      this.dataSelectorService.docStructSizePaginatorSubject.next(event.pageSize);
    }

    this.fillBuffer();
    this.updateDataSource(event);
  }

  private updateDataSource(event?: any) {
    if (event == null) {
      event = this.paginator;
    }

    const docStuctList = this.buffer.slice(
      event.pageIndex * event.pageSize,
      event.pageIndex * event.pageSize + event.pageSize);

    if (docStuctList.length > 0) {
      this.dataSource.data = docStuctList;
    }
  }

  private fillBuffer() {
    for (const docStruct of this.docStructList) {
      if (!this.buffer.find((el) => el.id === docStruct.id && el.year === docStruct.year)) {
        this.buffer.push(docStruct);
      }
    }
  }
}
