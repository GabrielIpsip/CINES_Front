import { Component, OnInit } from '@angular/core';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-documentary-structure-search',
  templateUrl: './documentary-structure-search.component.html',
  styleUrls: ['./documentary-structure-search.component.scss']
})
export class DocumentaryStructureSearchComponent implements OnInit {
  initWithSearch = false;

  constructor(
    private rightsCheckerService: RightsCheckerService
  ) { }

  ngOnInit() {
    this.initWithSearch = !this.rightsCheckerService.isADMIN(true);
  }
}
