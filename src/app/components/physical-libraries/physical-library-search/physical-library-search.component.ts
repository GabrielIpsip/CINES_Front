import { Component, OnInit } from '@angular/core';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-physical-library-search',
  templateUrl: './physical-library-search.component.html',
  styleUrls: ['./physical-library-search.component.scss']
})
export class PhysicalLibrarySearchComponent implements OnInit {
  initWithSearch = false;

  constructor(
    private rightsCheckerService: RightsCheckerService
  ) { }

  ngOnInit() {
    this.initWithSearch = !this.rightsCheckerService.isADMIN(true);
  }
}
