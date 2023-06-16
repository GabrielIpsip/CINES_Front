import { Component, OnInit, OnDestroy, EventEmitter, Output } from '@angular/core';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { LoaderService } from 'src/app/services/loader.service';
import { Observable } from 'rxjs';
import { Establishments } from 'src/app/models/establishments.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentary-structure-establishment-search-list',
  templateUrl: './documentary-structure-establishment-search-list.component.html',
  styleUrls: ['./documentary-structure-establishment-search-list.component.scss']
})
export class DocumentaryStructureEstablishmentSearchListComponent implements OnInit, OnDestroy {

  @Output() establishment = new EventEmitter<Establishments>();
  @Output() closeDialog = new EventEmitter<void>();

  searchResult: Observable<Establishments[]>;
  hasSearch: Observable<boolean>;

  constructor(
    private establishmentsService: EstablishmentsService,
    private router: Router,
    public loaderService: LoaderService,
    public rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.searchResult = this.establishmentsService.getEstablishmentList();
    this.hasSearch = this.establishmentsService.getHasSearch();
  }

  ngOnDestroy() {
    this.establishmentsService.cleanEstablishmentList();
    this.establishmentsService.updateHasSearch(false);
  }

  onLink(establishment: Establishments) {
    this.establishment.emit(establishment);
  }

  onCreateEstablishment() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/establishments/create']));
    window.open(url, '_blank');
  }

}
