import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { PHPDateTime } from 'src/app/models/broadcast/phpdate-time.model';
import { DatabaseExportService } from 'src/app/services/database-export.service';
import { EsgbuApiService } from 'src/app/services/esgbu-api.service';
import { RightsCheckerService } from 'src/app/services/rights-checker.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-database-export',
  templateUrl: './database-export.component.html',
  styleUrls: ['./database-export.component.scss']
})
export class DatabaseExportComponent implements OnInit, OnDestroy {

  isDiCoDoc = false;
  lastExportDate: PHPDateTime;

  currentUserSub: Subscription;

  constructor(
    private rightsChecker: RightsCheckerService,
    private databaseExportService: DatabaseExportService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService,
    private usersService: UsersService,
    private esgbuApiService: EsgbuApiService<any>
  ) { }

  get locale(): string {
    return this.translate.getDefaultLang();
  }

  get getApiUrl(): string {
    return this.esgbuApiService.baseApiUrl;
  }

  ngOnInit() {
    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => {
        if (value != null) {
          this.isDiCoDoc = this.rightsChecker.isADMIN();
        }
      }
    });

    this.setLastExportDate();
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }

  setLastExportDate() {
    this.databaseExportService.getDateLastExport().subscribe({
      next: (response) => {
        this.lastExportDate = new PHPDateTime(response);
        this.cdRef.detectChanges();
      },
      error: (error) => {
        if (error.status === 500) { /* Do nothing */ }
      }
    });
  }
}
