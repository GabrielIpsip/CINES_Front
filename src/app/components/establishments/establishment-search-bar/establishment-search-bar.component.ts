import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Establishments } from 'src/app/models/establishments.model';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Subscription } from 'rxjs';
import { StringTools } from 'src/app/utils/string-tools';

@Component({
  selector: 'app-establishment-search-bar',
  templateUrl: './establishment-search-bar.component.html',
  styleUrls: ['./establishment-search-bar.component.scss'],
})
export class EstablishmentSearchBarComponent implements OnInit, OnDestroy {

  @Input() filterId: number[];
  @Input() progressMode: boolean;
  @Input() totalProgressMode: boolean;
  @Input() initWithSearch = false;

  result: Establishments[];
  queryValue: string;
  progress: boolean;

  private establishmentListSub: Subscription;

  constructor(
    private establishmentService: EstablishmentsService
  ) { }

  ngOnInit() {
    this.progress = this.progressMode || this.totalProgressMode;
    this.queryValue = this.establishmentService.getSearchKeyword(this.progress);

    if (this.initWithSearch && (this.queryValue == null || this.queryValue.length === 0)) {
      this.onSearch();
    }

    this.establishmentListSub = this.establishmentService.getEstablishmentList(this.progress)
      .subscribe({
        next: (value) => {
          this.result = value;
        }
      });
  }

  ngOnDestroy() {
    this.establishmentListSub.unsubscribe();
    this.establishmentService.setsearchKeyWord(this.queryValue, this.progress);
  }

  onSearch() {
    this.establishmentService.updateHasSearch(true, this.progress);
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
    this.establishmentService.searchEstablishment(query, this.progressMode, this.totalProgressMode).subscribe({
      next: (response) => {
        if (this.progress) {
          response = response.filter(establishment => establishment.active);
        }
        this.establishmentService.updateEstablishmentList(response, this.progress);
      },
      error: (error) => {
        if (error.status === 404) {
          this.establishmentService.cleanEstablishmentList(this.progress);
        }
      }
    });
  }

  onSearchFilter() {
    let query = '';
    if (this.queryValue) {
      query = StringTools.buildQuery(this.queryValue);
    }
    this.establishmentService.searchEstablishment(query, this.progressMode, this.totalProgressMode)
      .subscribe(response => {
        const filteredResponse: Establishments[] = [];
        for (const establishment of response) {
          if (this.filterId.indexOf(establishment.id) === -1) {
            filteredResponse.push(establishment);
          }
        }
        this.establishmentService.updateEstablishmentList(filteredResponse, this.progress);
      });
  }

}
