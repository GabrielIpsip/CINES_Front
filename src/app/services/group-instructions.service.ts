import { Injectable } from '@angular/core';
import { GroupInstructions } from '../models/group-instructions.model';
import { EsgbuApiService } from './esgbu-api.service';
import { TranslateService } from '@ngx-translate/core';
import { catchError } from 'rxjs/operators';
import { Translation } from '../common/translation.interface';

interface BodyGroupInstruction {
  instructions: Translation[];
  groupId?: number;
  surveyId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class GroupInstructionsService {

  private readonly baseUrl = 'group-instructions';

  constructor(
    private esgbuApi: EsgbuApiService<GroupInstructions>,
    private translate: TranslateService
  ) { }

  getInstruction(groupId: number, surveyId: number, lang?: string) {
    if (lang == null) {
      lang = this.translate.getDefaultLang();
    }
    return this.esgbuApi.get(this.baseUrl + '/' + groupId + '/' + surveyId + '?lang=' + lang)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  updateInstruction(groupId: number, surveyId: number, translations: Translation[]) {
    const body: BodyGroupInstruction = { instructions: translations };
    return this.esgbuApi.put(this.baseUrl + '/' + groupId + '/' + surveyId + '?lang=' + this.translate.getDefaultLang(),
      body)
      .pipe(catchError(this.esgbuApi.handleError));
  }

  createInstruction(groupIdP: number, surveyIdP: number, translations: Translation[]) {
    const body: BodyGroupInstruction = { instructions: translations, groupId: groupIdP, surveyId: surveyIdP };
    return this.esgbuApi.post(this.baseUrl + '?lang=' + this.translate.getDefaultLang(), body)
      .pipe(catchError(this.esgbuApi.handleError));
  }
}
