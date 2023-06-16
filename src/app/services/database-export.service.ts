import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PHPDateTime } from '../models/broadcast/phpdate-time.model';
import { EnvironmentService } from './environment.service';
import { EsgbuApiService } from './esgbu-api.service';
import { CommonService } from './common-service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseExportService extends CommonService {

  private readonly baseUrl = 'database-export';

  readonly startMessage = 'database-export-start';
  readonly endMessage = 'database-export-end';

  constructor(
    private esgbuApi: EsgbuApiService<any>,
    environmentService: EnvironmentService
  ) {
    super(environmentService);
  }

  get MERCURE_KEY(): string {
    return 'http://esgbu.esr.gouv.fr/database-export';
  }

  isLocked(): Observable<boolean> {
    return this.esgbuApi.get(this.baseUrl + '/locked');
  }

  launchExport(justLastActive: string = null): Observable<boolean> {
    let url = this.baseUrl + '/run';
    if (justLastActive !== null)  {
      url += '?justLastActiveSurvey=' + justLastActive;
    }
    return this.esgbuApi.get(url);
  }

  getDateLastExport(): Observable<PHPDateTime> {
    return this.esgbuApi.get(this.baseUrl + '/date', true);
  }

}
