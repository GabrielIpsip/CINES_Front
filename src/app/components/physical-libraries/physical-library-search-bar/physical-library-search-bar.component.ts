import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { Subscription } from 'rxjs';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { StringTools } from 'src/app/utils/string-tools';

@Component({
  selector: 'app-physical-library-search-bar',
  templateUrl: './physical-library-search-bar.component.html',
  styleUrls: ['./physical-library-search-bar.component.scss'],
})
export class PhysicalLibrarySearchBarComponent implements OnInit, OnDestroy {

  @Input() filterId: number[];
  @Input() initWithSearch = false;

  result: PhysicalLibraries[];
  queryValue: string;

  private physicLibListSub: Subscription;

  constructor(
    private physicLibService: PhysicalLibrariesService
  ) { }

  ngOnInit() {
    this.queryValue = this.physicLibService.getSearchKeyword();

    if (this.initWithSearch && (this.queryValue == null || this.queryValue.length === 0)) {
      this.onSearch();
    }

    this.physicLibListSub = this.physicLibService.getPhysicLibList().subscribe({
      next: (value) => this.result = value
    });
  }

  ngOnDestroy() {
    this.physicLibListSub.unsubscribe();
    this.physicLibService.setSearchKeyword(this.queryValue);
  }

  onSearch() {
    this.physicLibService.updateHasSearch(true);
    if (this.filterId && this.filterId.length > 0) {
      this.onSearchFilter();
    } else {
      this.onSearchSimple();
    }
  }

  onSearchSimple() {
    let query = '';
    if (this.queryValue) {
      query = StringTools.buildQuery(this.queryValue);
    }
    this.physicLibService.searchPhysicLib(query).subscribe(
      response => {
        this.physicLibService.updatePhysicLibList(response);
      },
      error => {
        this.physicLibService.cleanPhysicLibList();
      });

  }

  onSearchFilter() {
    let query = '';
    if (this.queryValue) {
      query = StringTools.buildQuery(this.queryValue);
    }
    this.physicLibService.searchPhysicLib(query).subscribe(response => {
      const filteredResponse: PhysicalLibraries[] = [];
      for (const physicLib of response) {
        if (this.filterId.indexOf(physicLib.id) === -1) {
          filteredResponse.push(physicLib);
        }
      }
      this.physicLibService.updatePhysicLibList(filteredResponse);
    });
  }


}
