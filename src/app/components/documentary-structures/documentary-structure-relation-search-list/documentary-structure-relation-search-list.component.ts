import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-documentary-structure-relation-search-list',
  templateUrl: './documentary-structure-relation-search-list.component.html',
  styleUrls: ['./documentary-structure-relation-search-list.component.scss']
})
export class DocumentaryStructureRelationSearchListComponent implements OnInit, OnDestroy {

  @Input() resultDocStructId: number;
  @Input() validForm: boolean;
  @Output() originDocStructId = new EventEmitter<number>();
  @Output() closeDialog = new EventEmitter<void>();

  searchResult: Observable<DocumentaryStructures[]>;
  hasSearch: Observable<boolean>;

  constructor(
    private docStructsService: DocumentaryStructuresService,
    private router: Router,
    public loaderService: LoaderService,
    public rightsChecker: RightsCheckerService
    ) { }

  ngOnInit() {
    this.searchResult = this.docStructsService.getDocStructList();
    this.hasSearch = this.docStructsService.getHasSearch();
  }

  ngOnDestroy() {
    this.docStructsService.cleanDocStructList();
    this.docStructsService.updateHasSearch(false);
  }

  onAddRelation(originId: number) {
    this.originDocStructId.emit(originId);
  }

  onCreateRelation() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/documentary-structures/create']));
    window.open(url, '_blank');
  }

}
