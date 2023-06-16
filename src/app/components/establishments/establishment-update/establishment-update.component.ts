import { Establishments } from './../../../models/establishments.model';
import { EstablishmentsService } from './../../../services/establishments.service';
import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EstablishmentViewComponent } from '../establishment-view/establishment-view.component';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-establishment-update',
  templateUrl: './establishment-update.component.html',
  styleUrls: ['./establishment-update.component.scss']
})
export class EstablishmentUpdateComponent implements OnInit, AfterViewChecked, OnDestroy, ConfirmBeforeQuit {

  @ViewChild(EstablishmentViewComponent)
  establishmentView: EstablishmentViewComponent;

  establishmentId: number;
  establishmentToUpdate: Establishments;

  canQuit = false;

  constructor(
    private establishmentsService: EstablishmentsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private esgbuService: ESGBUService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
    ) { }

  ngOnInit() {
    this.establishmentId = this.activatedRoute.snapshot.params.id;
    this.establishmentsService.getEstablishment(this.establishmentId).subscribe(response => {
      this.establishmentToUpdate = response;
      this.esgbuService.setTitle(this.establishmentToUpdate.useName);
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  updateEstablishment() {
    const newEstablishment: Establishments = this.establishmentView.getNewValues();
    this.establishmentsService.updateEstablishment(this.establishmentId, newEstablishment).subscribe(response => {
      this.establishmentToUpdate = response;
      this.updatePopup();
      this.canQuit = true;
      this.router.navigate(['/establishments/' + this.establishmentId]);
    });
  }

  updatePopup() {
    this.translate.stream('establishment.updatePopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
