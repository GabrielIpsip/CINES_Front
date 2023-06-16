import { Component, OnInit, ViewChild, ChangeDetectorRef, AfterViewChecked, OnDestroy } from '@angular/core';
import { PhysicalLibraryViewComponent } from '../physical-library-view/physical-library-view.component';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { PhysicalLibrariesService } from 'src/app/services/physical-libraries.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';

@Component({
  selector: 'app-physical-library-update',
  templateUrl: './physical-library-update.component.html',
  styleUrls: ['./physical-library-update.component.scss']
})
export class PhysicalLibraryUpdateComponent implements OnInit, AfterViewChecked, OnDestroy, ConfirmBeforeQuit {

  @ViewChild(PhysicalLibraryViewComponent)
  physicLibView: PhysicalLibraryViewComponent;

  physicLibId: number;
  physicLibToUpdate: PhysicalLibraries;

  canQuit = false;

  constructor(
    private physicLibService: PhysicalLibrariesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private cdRef: ChangeDetectorRef,
    private esgbuService: ESGBUService,
    private translate: TranslateService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.physicLibId = this.activatedRoute.snapshot.params.id;
    this.physicLibService.getPhysicLib(this.physicLibId).subscribe({
      next: (response) => {
        this.physicLibToUpdate = response;
        this.esgbuService.setTitle(this.physicLibToUpdate.useName);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  updatePhysicLib() {
    const newPhysicLib: PhysicalLibraries = this.physicLibView.getNewValues();
    this.physicLibService.updatePhysicLib(this.physicLibId, newPhysicLib).subscribe({
      next: (response) => {
        this.physicLibToUpdate = response;
        this.updatePopup();
        this.canQuit = true;
        this.router.navigate(['/physical-libraries/' + this.physicLibId]);
      }
    });
  }

  updatePopup() {
    this.translate.stream('physicLib.updatePopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }
}
