import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { StringTools } from 'src/app/utils/string-tools';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Subscription } from 'rxjs';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';

@Component({
  selector: 'app-documentary-structure-search-bar',
  templateUrl: './documentary-structure-search-bar.component.html',
  styleUrls: ['./documentary-structure-search-bar.component.scss'],
})

export class DocumentaryStructureSearchBarComponent implements OnInit, OnDestroy {

  @Input() filterId: number[];
  @Input() associated = false;
  @Input() initWithSearch = false;

  result: DocumentaryStructures[];
  queryValue: string;

  private docStructListSub: Subscription;

  constructor(
    private docStructsService: DocumentaryStructuresService
  ) { }

  ngOnInit() {
    this.queryValue = this.docStructsService.getSearchKeyword();
    if (this.initWithSearch && (this.queryValue == null || this.queryValue.length === 0)) {
      this.onSearch();
    }

    this.docStructListSub = this.docStructsService.getDocStructList().subscribe({
      next: (value) => {
        this.result = value;
      }
    });
  }

  ngOnDestroy() {
    this.docStructListSub.unsubscribe();
    this.docStructsService.setSearchKeyword(this.queryValue);
  }

  onSearch() {
    this.docStructsService.updateHasSearch(true);
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
    this.docStructsService.searchDocStruct(query, this.associated).subscribe(
      response => {
        this.docStructsService.updateDocStructList(response);
      },
      error => {
        this.docStructsService.cleanDocStructList();
      });

  }

  onSearchFilter() {
    let query = '';
    if (this.queryValue) {
      query = StringTools.buildQuery(this.queryValue);
    }
    this.docStructsService.searchDocStruct(query).subscribe(response => {
      const filteredResponse: DocumentaryStructures[] = [];
      for (const docStruct of response) {
        if (this.filterId.indexOf(docStruct.id) === -1) {
          filteredResponse.push(docStruct);
        }
      }
      this.docStructsService.updateDocStructList(filteredResponse);
    });
  }

}
