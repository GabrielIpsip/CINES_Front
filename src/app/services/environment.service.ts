import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface Environment {
  apiUrl: string;
  log: boolean;
  mercureUrl: string;
  platform: string;
}

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  private appEnv: Environment;

  constructor(
    private httpClient: HttpClient
  ) { }

  loadEnvironment() {
    return this.httpClient.get<Environment>('assets/environment.json')
      .toPromise()
      .then(env => { this.appEnv = env; });
  }

  get environment() {
    if (this.appEnv == null) {
      throw Error('Config file not loaded!');
    }
    return this.appEnv;
  }

}
