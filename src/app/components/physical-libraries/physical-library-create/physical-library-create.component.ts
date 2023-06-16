import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked } from '@angular/core';
import { PhysicalLibraryViewComponent } from '../physical-library-view/physical-library-view.component';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-physical-library-create',
  templateUrl: './physical-library-create.component.html',
  styleUrls: ['./physical-library-create.component.scss']
})
export class PhysicalLibraryCreateComponent implements OnInit, AfterViewChecked, ConfirmBeforeQuit {

  @ViewChild(PhysicalLibraryViewComponent)
  physicLibView: PhysicalLibraryViewComponent;

  physicLibToCreate: PhysicalLibraries;

  canQuit = false;

  constructor(
    private physicLibService: PhysicalLibrariesService,
    private cdRef: ChangeDetectorRef,
    private router: Router,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.physicLibToCreate = new PhysicalLibraries();
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  createPhysicLib() {
    const newPhysicLib: PhysicalLibraries = this.physicLibView.getNewValues();
    this.physicLibService.createPhysicLib(newPhysicLib).subscribe({
      next: (response) => {
        this.physicLibToCreate = response;
        this.createPopup();
        this.canQuit = true;
        this.router.navigate(['/physical-libraries/' + this.physicLibToCreate.id]);
      }
    });
  }

  createPopup() {
    this.translate.stream('physicLib.createPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }
}
