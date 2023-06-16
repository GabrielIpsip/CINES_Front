import { AfterViewChecked, ChangeDetectorRef, EventEmitter, Input, OnDestroy, Output } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PHPDateTime } from 'src/app/models/broadcast/phpdate-time.model';
import { DatabaseExportService } from 'src/app/services/database-export.service';

@Component({
  selector: 'app-database-export-run-button',
  templateUrl: './database-export-run-button.component.html',
  styleUrls: ['./database-export-run-button.component.scss']
})
export class DatabaseExportRunButtonComponent implements OnInit, OnDestroy, AfterViewChecked {

  @Input() lastExportDate: PHPDateTime;
  @Input() justLastActiveSurvey: string = null;

  @Output() readyToDownload = new EventEmitter();

  canExport = false;
  exportEventSource: EventSource;
  buttonClicked = false;

  constructor(
    private databaseExportService: DatabaseExportService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  get locale(): string {
    return this.translate.getDefaultLang();
  }

  ngOnInit() {
    this.databaseExportService.isLocked().subscribe({
      next: (response) => this.canExport = !response
    });

    this.subscribeMercureEvent();
  }

  ngAfterViewChecked() {
    this.subscribeMercureEvent();
  }

  ngOnDestroy() {
    if (this.exportEventSource != null) {
      this.exportEventSource.close();
    }
  }

  private subscribeMercureEvent() {

    if (this.exportEventSource != null
      && (this.exportEventSource.readyState === this.exportEventSource.OPEN
        || this.exportEventSource.readyState === this.exportEventSource.CONNECTING)) {
      return;
    }

    this.exportEventSource = this.databaseExportService.getEventSource();
    this.exportEventSource.onmessage = event => {

      if (event.data === this.databaseExportService.endMessage) {
        this.lastExportDate = null;
        this.canExport = true;
        if (this.justLastActiveSurvey !== null && this.buttonClicked) {
          this.readyToDownload.emit();
          this.buttonClicked = false;
        }
      } else if (event.data === this.databaseExportService.startMessage) {
        this.canExport = false;
      }

      this.cdRef.detectChanges();
    };
  }

  runExport() {
    this.buttonClicked = true;
    this.databaseExportService.launchExport(this.justLastActiveSurvey).subscribe({
      next: (response) => this.canExport = !response
    });
  }

}
