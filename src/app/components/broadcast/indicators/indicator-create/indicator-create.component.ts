import { Component, ViewChild } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';
import { IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorViewComponent } from '../indicator-view/indicator-view.component';

@Component({
  selector: 'app-indicator-create',
  templateUrl: './indicator-create.component.html',
  styleUrls: ['./indicator-create.component.scss']
})
export class IndicatorCreateComponent implements ConfirmBeforeQuit {

  @ViewChild('indicatorView') indicatorView: IndicatorViewComponent;

  canQuit = false;

  constructor(
    private indicatorsService: IndicatorsService,
    private translate: TranslateService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  get isValidForm(): boolean {
    if (this.indicatorView == null) {
      return false;
    } else {
      return this.indicatorView.indicatorForm.valid;
    }
  }

  onClickCreateButton() {
    const indicatorBody = this.indicatorView.getNewValues();
    this.indicatorsService.createIndicator(indicatorBody).subscribe({
      next: (response) => {
      this.createPopup();
      this.canQuit = true;
      this.router.navigate(['/indicators/' + response.id]);
      }
    });
  }

  createPopup() {
    this.translate.stream('indicator.createPopup').subscribe({
      next: (value) => this.snackBar.open(value, null, { duration: 5000 })
    });
  }

}
