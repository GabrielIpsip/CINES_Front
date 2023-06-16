import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Establishments } from 'src/app/models/establishments.model';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { SurveyReplyButtonComponent } from '../../surveys/survey-reply-button/survey-reply-button.component';

@Component({
  selector: 'app-establishment-consult',
  templateUrl: './establishment-consult.component.html',
  styleUrls: ['./establishment-consult.component.scss']
})
export class EstablishmentConsultComponent implements OnInit, OnDestroy {

  @ViewChild('surveyReplyButton') surveyReplyButton: SurveyReplyButtonComponent;

  private establishmentId: number;

  establishment: Establishments;
  private establishmentSub: Subscription;

  constructor(
    private establishmentsService: EstablishmentsService,
    private activatedRoute: ActivatedRoute,
    private esgbuService: ESGBUService,
    public rightsChecker: RightsCheckerService
  ) { }

  ngOnInit() {
    this.establishmentId = this.activatedRoute.snapshot.params.id;
    this.establishmentSub = this.establishmentsService.getEstablishment(this.establishmentId).subscribe(response => {
      this.establishment = new Establishments(response);
      this.esgbuService.setTitle(this.establishment.useName);
    });
  }

  ngOnDestroy() {
    this.establishmentSub.unsubscribe();
    this.esgbuService.clearTitle();
  }

}
