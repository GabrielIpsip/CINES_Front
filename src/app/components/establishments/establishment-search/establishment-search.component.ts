import { Component, Input, OnInit } from '@angular/core';
import { Surveys } from 'src/app/models/surveys.model';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';

@Component({
  selector: 'app-establishment-search',
  templateUrl: './establishment-search.component.html',
  styleUrls: ['./establishment-search.component.scss']
})
export class EstablishmentSearchComponent implements OnInit {
  @Input() totalProgressMode: boolean;
  @Input() progressMode: boolean;
  @Input() survey: Surveys;

  initWithSearch = false;

  constructor(
    private rightsCheckerService: RightsCheckerService
  ) {}

  ngOnInit() {
    this.initWithSearch = !this.rightsCheckerService.isADMIN(true);
  }
}
