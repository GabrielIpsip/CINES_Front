import { Injectable } from '@angular/core';
import { EsgbuApiService } from './esgbu-api.service';
import { Administrations } from '../models/administrations.model';
import { DataValues } from '../models/data-values.model';
import { catchError } from 'rxjs/operators';
import { Surveys } from '../models/surveys.model';
import { DownloadFormatsEnum } from '../common/downloadFormatsEnum.enum';
import { EncodingEnum } from '../common/encodingEnum.enum';
import { TranslateService } from '@ngx-translate/core';
import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { Establishments } from '../models/establishments.model';
import { DocumentaryStructures } from '../models/documentary-structures.model';
import { PhysicalLibraries } from '../models/physical-libraries.model';

interface PartialBodyDataValues {
  value: string;
  surveyId: number;
  dataTypeId: number;
}

export interface EtabDepDocCheckBudget {
  EtabDepDoc: number;
  sumDepDTot: number;
  error: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class DataValuesService {

  private survey: Surveys;

  private baseUrl: string;
  private administrationLabelId: string;

  private administration: Administrations;

  constructor(
    protected esgbuService: EsgbuApiService<DataValues>,
    private esgbuEtabDepDocService: EsgbuApiService<EtabDepDocCheckBudget>,
    private translate: TranslateService
  ) {
  }

  setSurvey(survey: Surveys) {
    if (survey != null) {
      this.survey = survey;
      localStorage.setItem('survey', JSON.stringify(this.survey));
    }
  }

  getSurvey(): Surveys {
    if (this.survey == null) {
      this.setSurvey(JSON.parse(localStorage.getItem('survey')));
    }
    return this.survey;
  }

  setAdministration(administration: Administrations) {
    if (administration != null) {
      this.administration = administration;
      this.generateBaseUrlAndLabelId();
      localStorage.setItem('administration', JSON.stringify(this.administration));
    }
  }

  setAdministrationWithoutSave(administration: Administrations) {
    if (administration != null) {
      this.administration = administration;
      this.generateBaseUrlAndLabelId();
    }
  }

  getAdministration(): Administrations {
    if (this.administration == null) {
      let admin = JSON.parse(localStorage.getItem('administration'));

      switch (admin.TYPE_NAME) {
        case AdministrationTypesEnum.ESTABLISHMENT:
          admin = new Establishments(admin);
          break;
        case AdministrationTypesEnum.DOC_STRUCT:
          admin = new DocumentaryStructures(admin);
          break;
        case AdministrationTypesEnum.PHYSIC_LIB:
          admin = new PhysicalLibraries(admin);
          break;
      }

      this.setAdministration(admin);
    }

    return this.administration;
  }

  getAllValue(surveyId: number, type?: string) {
    if (this.administration == null) {
      return null;
    }

    let url = this.baseUrl + '?surveyId=' + surveyId +
      '&' + this.administrationLabelId + '=' + this.administration.id;

    if (type != null) {
      url += '&type=' + type;
    }

    return this.esgbuService.getAll(url).pipe(catchError(this.esgbuService.handleError));
  }


  insertValue(surveyId: number, dataTypeId: number, value: string) {
    if (this.administration == null) {
      return null;
    }
    return this.esgbuService.put(this.baseUrl, this.convertDataTypeToBody(surveyId, dataTypeId, value))
      .pipe(catchError(this.esgbuService.handleError));
  }

  deleteValue(surveyId: number, dataTypeId: number) {
    if (this.administration == null) {
      return null;
    }
    return this.esgbuService.delete(this.baseUrl + '/' + surveyId + '/' + this.administration.id + '/' + dataTypeId)
      .pipe(catchError(this.esgbuService.handleError));
  }

  checkBudget() {
    return this.esgbuEtabDepDocService.get(
      this.baseUrl + '/check-budget/' + this.survey.id + '/' + this.administration.id)
      .pipe(catchError(this.esgbuService.handleError));
  }

  downloadFile(format: DownloadFormatsEnum, encoding?: EncodingEnum, surveyId?: number): string {
    if (this.administration == null) {
      return null;
    }

    let url = this.esgbuService.baseApiUrl + this.baseUrl + '?' +
      this.administrationLabelId + '=' + this.administration.id  + '&lang=' + this.translate.getDefaultLang();

    if (format != null) {
      url += '&format=' + format;
    }

    if (encoding != null) {
      url += '&encoding=' + encoding;
    }

    if (surveyId != null) {
      url += '&surveyId=' + surveyId;
    }

    return url;
  }

  private generateBaseUrlAndLabelId() {
    if (this.administration.CLASS_NAME.length > 0) {
      this.baseUrl = this.administration.KEBAB_CASE_NAME + '-data-values';
      this.administrationLabelId = this.administration.PARAMETER_NAME + 'Id';
    }
  }

  private convertDataTypeToBody(surveyIdP: number, dataTypeIdP: number, valueP: string): PartialBodyDataValues {
    const body = {
      value: valueP,
      dataTypeId: dataTypeIdP,
      surveyId: surveyIdP
    };
    body[this.administrationLabelId] = this.administration.id;
    return body;
  }

}
