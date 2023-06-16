import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import version from '../../assets/version.json';
import { Title } from '@angular/platform-browser';
import { Lang } from '../common/lang.interface.js';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class ESGBUService {

  readonly DEFAULT_LANG = 'fr';
  readonly AVAILABLE_LANG: Lang[] = [
    { country: 'fr', language: 'fr' },
    { country: 'gb', language: 'en' }
  ];

  readonly version = version.version;
  private appTitle: string;

  private titleSubject = new BehaviorSubject<string>('');
  titleObs = this.titleSubject.asObservable();

  private titleOfTitleSubject = new BehaviorSubject<string>('');
  titleOfTitleObs = this.titleOfTitleSubject.asObservable();

  constructor(
    private titleService: Title,
    private translate: TranslateService
  ) {
    this.appTitle = this.titleService.getTitle();
  }

  setTitle(value: string, translate = false) {
    if (translate) {
      this.translate.stream(value).subscribe({
        next: (translateValue) => this.buildAndSetTitle(translateValue)
      });
    } else {
      this.buildAndSetTitle(value);
    }
  }

  addElementTitle(element: string) {
    this.titleOfTitleSubject.next(this.titleOfTitleSubject.value + ' > ' + element);
    element = (element.length > 50) ? element.slice(0, 50) + '..' : element;
    this.titleSubject.next(this.titleSubject.value + ' > ' + element);
    this.titleService.setTitle(this.appTitle + ' - ' + this.titleSubject.value);
  }

  clearTitle() {
    this.titleSubject.next('');
    this.titleOfTitleSubject.next('');
    this.titleService.setTitle(this.appTitle);
  }

  private buildAndSetTitle(value: string) {
    this.titleOfTitleSubject.next(value);
    value = (value.length > 50) ? value.slice(0, 50) + '..' : value;
    this.titleSubject.next(value);
    this.titleService.setTitle(this.appTitle + ' - ' + this.titleSubject.value);
  }

}
