import { Component, Input } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { EncodingEnum } from 'src/app/common/encodingEnum.enum';
import { Surveys } from 'src/app/models/surveys.model';
import { EnvironmentService } from 'src/app/services/environment.service';

@Component({
  selector: 'app-database-export-active-survey',
  templateUrl: './database-export-active-survey.component.html',
  styleUrls: ['./database-export-active-survey.component.scss']
})
export class DatabaseExportActiveSurveyComponent {

  @Input() survey: Surveys;

  administrationTypes = AdministrationTypesEnum;
  typeSelected = AdministrationTypesEnum.ESTABLISHMENT;

  encodingFormats = EncodingEnum;
  encodingSelected = EncodingEnum.CP1252;

  constructor(
    private environmentService: EnvironmentService,
  ) { }

  downloadLastActiveSurveyFile() {
    let fileName = this.environmentService.environment.apiUrl;
    const surveyDataCalendarYear = this.survey.dataCalendarYear;

    if (!fileName.endsWith('/')) {
      fileName += '/';
    }

    fileName += 'database_export/csv/' + this.encodingSelected + '_LAST_' + surveyDataCalendarYear + '_';

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

    fileName += '_general_infos_and_data.csv';
    window.location.href = fileName;
  }

  returnZero(): number {
    return 0;
  }

}
