import { Component, Input } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { EncodingEnum } from 'src/app/common/encodingEnum.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-data-selector-export-table',
  templateUrl: './data-selector-export-table.component.html',
  styleUrls: ['./data-selector-export-table.component.scss']
})
export class DataSelectorExportTableComponent {

  @Input() administrationType: AdministrationTypesEnum;

  private readonly XLSX_EXTENSION = '.xlsx';

  private readonly CSV_EXTENSION = '.csv';
  private readonly CSV_TYPE = 'text/csv;';

  administrations: BroadcastAdministration[];

  encodingEnum = EncodingEnum;

  constructor(
    private dataSelectorService: DataSelectorService,
    private translate: TranslateService,
    private utilsService: UtilsService
  ) { }

  exportToXLSX() {
    this.getWorkSheet(this.administrationType).then((workSheet) => {
      const workSheetName = this.translate.instant('db.administrationTypes.plural.' + this.administrationType);

      const workbook: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, workSheet.workSheet, workSheet.name);
      XLSX.writeFile(workbook, workSheetName + this.XLSX_EXTENSION);
    });
  }

  exportAllToXLSX() {
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();

    Promise.all([
      this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.ESTABLISHMENT),
      this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.DOC_STRUCT),
      this.dataSelectorService.getStoredValidateSelection(AdministrationTypesEnum.PHYSIC_LIB)
    ]).then((administrations) => {

      const establishments = administrations[0];
      const docStructs = administrations[1];
      const physicLibs = administrations[2];

      const workSheetPromises: Promise<any>[] = [];

      if (establishments?.length > 0) {
        workSheetPromises.push(this.getWorkSheet(AdministrationTypesEnum.ESTABLISHMENT).then((establishmentWorkSheet) => {
          XLSX.utils.book_append_sheet(workbook, establishmentWorkSheet.workSheet, establishmentWorkSheet.name);
        }));
      }

      if (docStructs?.length > 0) {
        workSheetPromises.push(this.getWorkSheet(AdministrationTypesEnum.DOC_STRUCT).then((docStructWorkSheet) => {
          XLSX.utils.book_append_sheet(workbook, docStructWorkSheet.workSheet, docStructWorkSheet.name);
        }));
      }

      if (physicLibs?.length > 0) {
        workSheetPromises.push(this.getWorkSheet(AdministrationTypesEnum.PHYSIC_LIB).then((physicLibWorkSheet) => {
          XLSX.utils.book_append_sheet(workbook, physicLibWorkSheet.workSheet, physicLibWorkSheet.name);
        }));
      }

      Promise.all(workSheetPromises).then(() => {
        XLSX.writeFile(workbook, this.translate.instant('info.data') + this.XLSX_EXTENSION);
      });
    });
  }

  exportToCSV(encoding: EncodingEnum) {
    this.getWorkSheet(this.administrationType).then((workSheet) => {
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
    });
  }

  private async getWorkSheet(administrationType: AdministrationTypesEnum)
    : Promise<{ name: string, workSheet: XLSX.WorkSheet }> {

    const table = [];
    table.push([this.translate.instant('info.years'), this.translate.instant('establishment.view.useName')]);
    const members = ['year', 'useName'];

    const dataTypes = this.dataSelectorService.getStoredSelectedType(administrationType);
    const administrations = await this.dataSelectorService.getStoredValidateSelection(administrationType);

    for (const dataType of dataTypes) {
      members.push(dataType.code);
      table[0].push(dataType.name);
    }


    for (const administration of administrations) {
      const line = [];
      for (const member of members) {
        const value = administration[member];
        if (value == null) {
          line.push(null);
        } else {
          line.push(this.formatValue(value));
        }
      }
      table.push(line);
    }

    return {
      name: this.translate.instant('db.administrationTypes.plural.' + administrationType),
      workSheet: XLSX.utils.json_to_sheet(table, { skipHeader: true })
    };
  }

  formatValue(value: any): any {
    switch (typeof (value)) {

      case 'boolean':
        if (value == null) {
          return null;
        } else if (value) {
          return this.translate.instant('info.yes').toLowerCase();
        } else {
          return this.translate.instant('info.no').toLowerCase();
        }

      default:
        return value;
    }
  }

}
