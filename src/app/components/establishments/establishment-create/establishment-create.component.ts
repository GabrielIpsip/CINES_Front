import { Component, OnInit, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { EstablishmentViewComponent } from '../establishment-view/establishment-view.component';
import { Establishments } from 'src/app/models/establishments.model';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-establishment-create',
  templateUrl: './establishment-create.component.html',
  styleUrls: ['./establishment-create.component.scss']
})
export class EstablishmentCreateComponent implements OnInit, AfterViewChecked, ConfirmBeforeQuit {

  @ViewChild(EstablishmentViewComponent)
  establishmentView: EstablishmentViewComponent;

  establishmentToCreate: Establishments;

  canQuit = false;

  constructor(
    private establishmentsService: EstablishmentsService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.establishmentToCreate = new Establishments();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  createEstablishment() {
    const newEstablishment: Establishments = this.establishmentView.getNewValues();
    this.establishmentsService.createEstablishment(newEstablishment).subscribe(response => {
      this.establishmentToCreate = response;
      this.createPopup();
      this.canQuit = true;
      this.router.navigate(['/establishments/' + this.establishmentToCreate.id]);
    });
  }

  createPopup() {
    this.translate.stream('establishment.createPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
