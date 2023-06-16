import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Establishments } from 'src/app/models/establishments.model';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-establishment-relation-search-list',
  templateUrl: './establishment-relation-search-list.component.html',
  styleUrls: ['./establishment-relation-search-list.component.scss']
})
export class EstablishmentRelationSearchListComponent implements OnInit, OnDestroy {

  @Input() resultEstablishmentId: number;
  @Input() validForm: boolean;
  @Output() originEstablishmentId = new EventEmitter<number>();
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

  onAddRelation(originId: number) {
    this.originEstablishmentId.emit(originId);
  }

  onCreateRelation() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/establishments/create']));
    window.open(url, '_blank');
  }

}
