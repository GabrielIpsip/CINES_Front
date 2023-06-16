import { Component, Input, OnInit } from '@angular/core';
import { EncodingEnum } from 'src/app/common/encodingEnum.enum';
import { DownloadFormatsEnum } from 'src/app/common/downloadFormatsEnum.enum';
import { DataValuesService } from 'src/app/services/data-values.service';
import { Administrations } from 'src/app/models/administrations.model';
import { Surveys } from 'src/app/models/surveys.model';

@Component({
  selector: 'app-export-administration-menu',
  templateUrl: './export-administration-menu.component.html',
  styleUrls: ['./export-administration-menu.component.scss']
})
export class ExportAdministrationMenuComponent implements OnInit {

  @Input() administration: Administrations;
  @Input() surveys: Surveys[];

  csvUrlDownload: string;
  pdfUrlDownload: string;

  encodingEnum = EncodingEnum;

  constructor(
    private dataValuesService: DataValuesService
  ) { }

  ngOnInit() {
    this.dataValuesService.setAdministration(this.administration);
  }

  private initDownloadCsv(encoding: EncodingEnum) {
    this.csvUrlDownload = this.dataValuesService.downloadFile(DownloadFormatsEnum.csv, encoding);
  }

  private initDownloadPdf(surveyId: number) {
    this.pdfUrlDownload = this.dataValuesService.downloadFile(DownloadFormatsEnum.pdf, null, surveyId);
  }

  downloadCSV(encoding: EncodingEnum) {
    this.initDownloadCsv(encoding);
    window.location.href = this.csvUrlDownload;
  }

  downloadPDF(surveyId: number) {
    this.initDownloadPdf(surveyId);
    window.location.href = this.pdfUrlDownload;
  }

}
