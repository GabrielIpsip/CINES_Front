import { Component, OnInit } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { EncodingEnum } from 'src/app/common/encodingEnum.enum';
import { BroadcastInstitutionsService } from 'src/app/services/broadcast/broadcast-institutions.service';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-database-export-selector',
  templateUrl: './database-export-selector.component.html',
  styleUrls: ['./database-export-selector.component.scss']
})
export class DatabaseExportSelectorComponent implements OnInit {

  dateList: string[];

  encodingFormats = EncodingEnum;
  administrationTypes = AdministrationTypesEnum;

  generalInfo = false;
  typeSelected: string;
  encodingSelected: string;
  yearSelected: string;

  constructor(
    private environmentService: EnvironmentService,
    private institutionService: BroadcastInstitutionsService
  ) { }


  ngOnInit() {
    this.institutionService.getAllYears().subscribe({
      next: (response) => this.dateList = this.institutionService
        .getAggregationsKey(response, this.institutionService.YEARS_AGGS_NAME)
        .sort()
        .reverse()
    });
  }

  downloadFile() {
    let fileName = this.environmentService.environment.apiUrl;

    if (!fileName.endsWith('/')) {
      fileName += '/';
    }

    fileName += 'database_export/csv/' + this.encodingSelected + '_';

    if (this.yearSelected !== 'all') {
      fileName += this.yearSelected + '_';
    }

    switch (this.typeSelected) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        fileName += 'institutions';
        break;

      case AdministrationTypesEnum.DOC_STRUCT:
        fileName += 'documentary_structures';
        break;

      case AdministrationTypesEnum.PHYSIC_LIB:
        fileName += 'physical_libraries';
        break;
    }

    fileName += '_general_infos';

    if (!this.generalInfo) {
      fileName += '_and_data';
    }

    fileName += '.csv';

    window.location.href = fileName;
  }

  returnZero(): number {
    return 0;
  }

}
