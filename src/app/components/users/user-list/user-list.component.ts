import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Users } from 'src/app/models/users.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { UsersService } from 'src/app/services/users.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {

  columnsToDisplay = ['eppn', 'firstname', 'lastname', 'mail', 'phone', 'active', 'valid'];
  dataSource: MatTableDataSource<Users>;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private usersService: UsersService,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.translate.stream('info.itemPerPage')
      .subscribe((val: string) => this.paginator._intl.itemsPerPageLabel = val);
    this.translate.stream('info.nextPage')
      .subscribe((val: string) => this.paginator._intl.nextPageLabel = val);
    this.translate.stream('info.previousPage')
      .subscribe((val: string) => this.paginator._intl.previousPageLabel = val);

    this.usersService.getAllUsers().subscribe({
      next: (response) => {
        this.dataSource = new MatTableDataSource(response);
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
