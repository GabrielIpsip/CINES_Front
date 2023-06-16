import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { LoaderService } from 'src/app/services/loader.service';
import { TranslateService } from '@ngx-translate/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-physical-library-search-list',
  templateUrl: './physical-library-search-list.component.html',
  styleUrls: ['./physical-library-search-list.component.scss']
})
export class PhysicalLibrarySearchListComponent implements OnInit, OnDestroy {

  searchResult: Observable<PhysicalLibraries[]>;
  hasSearch: Observable<boolean>;

  columnsToDisplay = ['id', 'useName', 'city', 'active'];
  dataSource: MatTableDataSource<PhysicalLibraries>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;


  constructor(
    private physicLibService: PhysicalLibrariesService,
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

    this.physicLibService.getPhysicLibList().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });

    this.hasSearch = this.physicLibService.getHasSearch();
    this.physicLibService.setSaveResultList();
  }

  ngOnDestroy() {
    this.physicLibService.SaveResultList();
    this.physicLibService.cleanPhysicLibList();
    this.physicLibService.updateHasSearch(false);
  }

}
