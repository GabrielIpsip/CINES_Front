import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { EncodingEnum } from 'src/app/common/encodingEnum.enum';
import { AggregationType, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { IndicatorChartValue } from '../indicator-card-chart/indicator-card-chart.component';
import * as XLSX from 'xlsx';
import { IndicatorGroup } from '../indicator-list/indicator-list.component';
import { saveAs } from 'file-saver';
import { UtilsService } from 'src/app/services/utils.service';
import { toSvg, toJpeg, toPng } from 'html-to-image';
import { ImgEnum } from 'src/app/common/imgEnum.enum';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-indicator-export',
  templateUrl: './indicator-export.component.html',
  styleUrls: ['./indicator-export.component.scss']
})
export class IndicatorExportComponent implements OnInit {

  @Input() isKeyFigure: boolean;
  @Input() indicators: Map<string, Map<string, IndicatorGroup>>;
  @Input() dateUsed: string[];
  @Input() aggregationType: AggregationType;
  @Input() keysUsed: number[] | string[];

  encodingEnum = EncodingEnum;
  imgEnum = ImgEnum;

  private readonly XLSX_EXTENSION = '.xlsx';

  private readonly CSV_EXTENSION = '.csv';
  private readonly CSV_TYPE = 'text/csv;';

  static getCardListId(aggregationType: AggregationType): string {
    return aggregationType + '-cards-list';
  }

  constructor(
    private translate: TranslateService,
    private indicatorsService: IndicatorsService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {

  }

  exportToCSV(encoding: EncodingEnum) {
    const workSheet = this.getWorksheet(false);
    const csv: string = XLSX.utils.sheet_to_csv(workSheet.workSheet, { FS: ';' });
    if (encoding === EncodingEnum.UTF8) {
      saveAs(new Blob([csv], { type: this.CSV_TYPE + 'charset=' + encoding }), workSheet.name + this.CSV_EXTENSION);
    } else {
      this.utilsService.encodeString(encoding, workSheet.name + this.CSV_EXTENSION, csv).subscribe({
        next: (response) => {
          window.location.href = response;
        }
      });
    }
  }

  exportToXLSX() {
    const workSheet = this.getWorksheet(true);
    const workSheetName = workSheet.name;

    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, workSheet.workSheet, workSheet.name);
    XLSX.writeFile(workbook, workSheetName + this.XLSX_EXTENSION);
  }

  exportToImage(imgType: ImgEnum) {
    const indicatorListElement = document.getElementById(IndicatorExportComponent.getCardListId(this.aggregationType));
    let downloadPromise: Promise<string>;

    switch (imgType) {
      case ImgEnum.jpg:
        downloadPromise = toJpeg(indicatorListElement, {
          filter: this.filterImage,
          style: { backgroundColor: 'white' }
        });
        break;
      case ImgEnum.png:
        downloadPromise = toPng(indicatorListElement, { filter: this.filterImage });
        break;
      case ImgEnum.svg:
        downloadPromise = toSvg(indicatorListElement, { filter: this.filterImage });
        break;
    }

    downloadPromise.then((image) => {
      const link = document.createElement('a');
      link.download = this.getFileName() + '.' + imgType;
      link.href = image;
      link.click();
    });
  }

  exportToPDF() {
    const docDefinition: any = {
      pageOrientation: 'landscape',
      content: [],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        header: {
          bold: true,
          fontSize: 16,
          color: 'black',
          margin: [0, 10, 0, 10],
        },
        subheader: {
          bold: true,
          fontSize: 14,
          color: 'black',
          margin: [0, 10, 0, 10]
        },
        exportTable: {

        }
      }
    };

    this.buildPDFDataTable(docDefinition);
    pdfMake.createPdf(docDefinition).open();
  }

  private buildPDFDataTable(docDefinition: any) {
    const tableTemplate = this.buildPDFTableTemplate();
    const data = this.generateData(false, true);

    let year = '';
    let entity = '';
    let table = JSON.parse(tableTemplate);

    for (const d of data) {

      if (d[0] !== year) {
        year = d[0];

        if (table.table.body.length > 1) {
          docDefinition.content.push(table);
          table = JSON.parse(tableTemplate);
        }

        docDefinition.content.push({ text: year, style: 'header' });
      }

      if (this.aggregationType !== AggregationType.global && d[1] !== entity) {
        entity = d[1];

        if (table.table.body.length > 1) {
          docDefinition.content.push(table);
          table = JSON.parse(tableTemplate);
        }

        docDefinition.content.push({ text: + year + ' - ' + entity, style: 'subheader' });

      }

      const line = [];
      if (this.aggregationType === AggregationType.global) {
        line.push(d[1]);
        line.push({ text: d[2].replace(/[\s]/g, ' '), alignment: 'right' });
        line.push(d[3]);
      } else {
        line.push(d[2]);
        line.push({ text: d[3].replace(/[\s]/g, ' '), alignment: 'right' });
        line.push(d[4]);
      }

      table.table.body.push(line);
    }

    docDefinition.content.push(table);
  }

  private buildPDFTableTemplate(): string {
    const headers = this.getHeaders();

    const tableHeader = [];
    let i = 0;
    for (const header of headers) {

      if (this.aggregationType === AggregationType.global && i === 0) {
        i++;
        continue;
      }

      if (this.aggregationType !== AggregationType.global && i < 2) {
        i++;
        continue;
      }

      tableHeader.push({
        text: header,
        style: 'tableHeader'
      });

      i++;
    }

    return JSON.stringify({
      style: 'exportTable',
      table: {
        widths: [200, 100, '*'],
        headerRows: 1,
        body: [
          tableHeader
        ],
        dontBreakRows: true
      }
    });
  }

  private filterImage(node: HTMLElement) {
    return (node.tagName !== 'MAT-ICON');
  }

  private getWorksheet(numberValue: boolean): { name: string, workSheet: XLSX.WorkSheet } {
    let table = [this.getHeaders()];
    table = table.concat(this.generateData(numberValue, false));

    return {
      name: this.getFileName(),
      workSheet: XLSX.utils.json_to_sheet(table, { skipHeader: true })
    };
  }

  private getHeaders(): string[] {
    const headers = [this.translate.instant('info.year')];

    if (this.aggregationType !== AggregationType.global) {
      headers.push(this.getKeyColumnName());
    }

    headers.push(this.translate.instant(this.isKeyFigure ? 'indicator.keyFigure' : 'indicator.indicator'));
    headers.push(this.translate.instant('indicator.value'));
    headers.push(this.translate.instant(this.isKeyFigure ? 'indicator.keyFigureDescription' : 'indicator.description'));

    return headers;
  }

  private generateData(numberValue: boolean, withPrefixSuffix: boolean): any[][] {
    const data = [];
    for (const [year, indicatorGroups] of this.indicators) {

      if (!this.dateUsed.includes(year)) {
        continue;
      }

      for (const [key, indicatorGroup] of indicatorGroups) {

        if (this.keysUsed != null && this.keysUsed.length > 0 && !this.keysUsed.includes(key as never)) {
          continue;
        }

        let index = 0;
        for (const indicator of indicatorGroup.indicators) {

          if (this.indicatorsService.isHideIndicatorInList(index, this.isKeyFigure, this.aggregationType)) {
            index++;
            continue;
          }

          const line: (string | number)[] = [year];

          if (this.aggregationType !== AggregationType.global) {
            line.push(indicatorGroup.key);
          }

          line.push(indicator.name);
          line.push(this.formatValue(indicator, numberValue, withPrefixSuffix));
          line.push(indicator.description);

          data.push(line);
          index++;
        }
      }
    }
    return data;
  }

  private getFileName(): string {
    const fileName: string = this.translate.instant(
      this.isKeyFigure
        ? 'indicator.keyFigures'
        : 'indicator.simpleIndicators');
    return fileName.replace(' ', '_');
  }

  private formatValue(indicator: IndicatorChartValue, returnNumber: boolean, withPrefixSuffix: boolean)
    : string | number {
    let params = {};
    let value = indicator.value;

    if (this.isKeyFigure) {
      value = Math.round(value);
    } else {
      params = { minimumFractionDigits: 2, maximumFractionDigits: 2 };
    }

    if (returnNumber) {
      return Number.parseFloat(value.toFixed(2));
    }

    let formattedValue = value.toLocaleString(this.translate.getDefaultLang(), params);

    if (formattedValue.trim().length === 0) {
      return '';
    }

    if (withPrefixSuffix) {
      if (indicator.prefix != null && indicator.prefix.length > 0) {
        formattedValue = indicator.prefix + ' ' + formattedValue;
      }

      if (indicator.suffix != null && indicator.suffix.length > 0) {
        formattedValue = formattedValue + ' ' + indicator.suffix;
      }
    }

    return formattedValue;
  }

  private getKeyColumnName(): string {
    switch (this.aggregationType) {
      case AggregationType.byRegion:
        return this.translate.instant('info.singularRegion');
      case AggregationType.byEstablishment:
        return this.translate.instant('db.administrationTypes.institution');
      case AggregationType.byDocStruct:
        return this.translate.instant('db.administrationTypes.documentaryStructure');
    }
    return '';
  }
}
