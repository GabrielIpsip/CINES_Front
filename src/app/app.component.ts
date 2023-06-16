import { Component, OnInit, ChangeDetectorRef, AfterViewChecked, ViewChild, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ESGBUService } from './services/esgbu.service';
import { UsersService } from './services/users.service';
import { Users } from './models/users.model';
import version from '../assets/version.json';
import { Lang } from './common/lang.interface';
import { EnvironmentService } from './services/environment.service';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { BroadcastMainMenuComponent } from './components/broadcast/broadcast-main-menu/broadcast-main-menu.component';
import { FooterBarComponent } from './components/footer/footer-bar/footer-bar.component';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, AfterViewChecked, OnDestroy {

  @ViewChild('mainMenu') mainMenu: MainMenuComponent;
  @ViewChild('broadcastMenu') broadcastMenu: BroadcastMainMenuComponent;
  @ViewChild('footerBar') footerBar: FooterBarComponent;

  currentUser: Users;
  currentUserSub: Subscription;
  langs: Lang[];

  constructor(
    private translate: TranslateService,
    private usersService: UsersService,
    private cdRef: ChangeDetectorRef,
    private environmentService: EnvironmentService,
    public esgbuService: ESGBUService
  ) {
    this.langs = this.esgbuService.AVAILABLE_LANG;
    let codeLang = localStorage.getItem('language');
    if (!codeLang) {
      codeLang = this.esgbuService.DEFAULT_LANG;
    }
    translate.setDefaultLang(codeLang);
    translate.use(codeLang);
    localStorage.setItem('language', codeLang);
  }

  get appVersion(): string {
    return version.version;
  }

  get appPlatform(): string {
    return this.environmentService.environment.platform;
  }

  ngOnInit() {
    this.usersService.initializeCurrentUser();
    this.currentUserSub = this.usersService.getCurrentUser().subscribe({
      next: (value) => this.currentUser = value
    });
  }

  ngAfterViewChecked() {
    this.cdRef.detectChanges();
  }

  ngOnDestroy() {
    this.currentUserSub?.unsubscribe();
  }

  onChangeLang(language: string) {
    this.translate.setDefaultLang(language);
    localStorage.setItem('language', language);
    location.reload();
  }

  sendResizeWindow() {
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 500);
  }
}
