import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { Observable } from 'rxjs';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { LoaderService } from 'src/app/services/loader.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-physical-library-doc-struct-search-list',
  templateUrl: './physical-library-doc-struct-search-list.component.html',
  styleUrls: ['./physical-library-doc-struct-search-list.component.scss']
})
export class PhysicalLibraryDocStructSearchListComponent implements OnInit, OnDestroy {

  @Output() docStruct = new EventEmitter<DocumentaryStructures>();
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

  onLink(docStruct: DocumentaryStructures) {
    this.docStruct.emit(docStruct);
  }

  onCreateDocStruct() {
    const url = this.router.serializeUrl(this.router.createUrlTree(['/documentary-structures/create']));
    window.open(url, '_blank');
  }

}
