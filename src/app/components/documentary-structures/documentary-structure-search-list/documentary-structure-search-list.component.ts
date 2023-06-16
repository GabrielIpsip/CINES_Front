import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Observable } from 'rxjs';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { LoaderService } from 'src/app/services/loader.service';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-documentary-structure-search-list',
  templateUrl: './documentary-structure-search-list.component.html',
  styleUrls: ['./documentary-structure-search-list.component.scss']
})
export class DocumentaryStructureSearchListComponent implements OnInit, OnDestroy {

  searchResult: Observable<DocumentaryStructures[]>;
  hasSearch: Observable<boolean>;

  columnsToDisplay = ['id', 'useName', 'city', 'active'];
  dataSource: MatTableDataSource<DocumentaryStructures>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    public loaderService: LoaderService,
    private translate: TranslateService
    ) { }

  ngOnInit() {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.docStructsService.getDocStructList().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

    this.hasSearch = this.docStructsService.getHasSearch();
    this.docStructsService.setSaveResultList();
  }

  ngOnDestroy() {
    this.docStructsService.SaveResultList();
    this.docStructsService.cleanDocStructList();
    this.docStructsService.updateHasSearch(false);
  }

}
