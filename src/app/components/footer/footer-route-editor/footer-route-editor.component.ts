import { AfterContentChecked, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { Lang } from 'src/app/common/lang.interface';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';
import { Routes } from 'src/app/models/routes.model';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { RoutesService } from 'src/app/services/routes.service';

@Component({
  selector: 'app-footer-route-editor',
  templateUrl: './footer-route-editor.component.html',
  styleUrls: ['./footer-route-editor.component.scss']
})
export class FooterRouteEditorComponent implements OnInit, AfterContentChecked, ConfirmBeforeQuit {

  routeContent = new Map<string, Routes>();
  routeName: string;

  canQuit = false;

  editorConfig: AngularEditorConfig = {
    editable: true,
    spellcheck: true,
    height: 'auto',
    minHeight: '200px',
    maxHeight: 'auto',
    width: 'auto',
    minWidth: '0',
    translate: 'yes',
    enableToolbar: true,
    showToolbar: true,
    defaultParagraphSeparator: '',
    defaultFontName: 'Roboto',
    defaultFontSize: '',
    fonts: [
      { class: 'Roboto', name: 'Roboto' },
      { class: 'Helvetica Neue', name: 'Helvetica Neue' },
      { class: 'sans-serif', name: 'Sans serif' },
      { class: 'arial', name: 'Arial' },
      { class: 'times-new-roman', name: 'Times New Roman' },
      { class: 'calibri', name: 'Calibri' },
      { class: 'comic-sans-ms', name: 'Comic Sans MS' }
    ],
    uploadUrl: 'v1/image',
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertVideo']
    ]
  };

  constructor(
    private routesService: RoutesService,
    private esgbuService: ESGBUService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { }

  get availableLang(): Lang[] {
    return this.esgbuService.AVAILABLE_LANG;
  }

  ngOnInit() {
    this.routeName = this.activatedRoute.snapshot.params.name;

    for (const lang of this.availableLang) {
      this.routesService.getRouteByName(this.routeName, lang.language).subscribe({
        next: (response) => this.routeContent.set(lang.language, response)
      });
    }
  }

  ngAfterContentChecked() {
    this.editorConfig.uploadUrl = this.routesService.getRootUrlImage(this.routeName);
  }

  saveRouteContent(lang: Lang, quit: boolean) {
    const route = this.routeContent.get(lang.language);

    this.routesService.updateRouteByName(route.route.name, route.content, route.language.code).subscribe({
      next: (response) => {
        this.routeContent.set(response.language.code, response);
        if (quit) {
          this.canQuit = true;
          this.router.navigate([this.routeName]);
        }
      }
    });
  }

}
