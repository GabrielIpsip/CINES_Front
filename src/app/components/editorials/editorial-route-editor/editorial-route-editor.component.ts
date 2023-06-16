import { AfterContentChecked, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { EditorialTabContent } from 'src/app/models/editorials.model';
import { Routes } from 'src/app/models/routes.model';
import { RoutesService } from 'src/app/services/routes.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editorial-route-editor',
  templateUrl: './editorial-route-editor.component.html',
  styleUrls: ['./editorial-route-editor.component.scss']
})
export class EditorialRouteEditorComponent implements OnInit, OnDestroy, AfterContentChecked {

  @Input() locale: string;
  @Output() canQuit = new EventEmitter<boolean>();

  editorial: any;
  editorialRouteName: string;

  autoSaveInterval: any;
  initialized = false;

  lastSave: number;
  autoSave = true;

  titleKey = '#<title>#-';
  contentKey = '#<content>#-';
  editorialForm: FormGroup;

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
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertVideo']
    ]
  };

  constructor(
    private routesService: RoutesService,
    private router: Router,
    private confirmDialog: MatDialog
  ) { }

  ngOnInit() {
    this.editorialRouteName = this.routesService.editorialRouteName;

    this.routesService.getRouteByName(this.editorialRouteName, this.locale).subscribe({
      next: (response) => this.initEditorial(response)
    });
  }

  ngAfterContentChecked() {
    this.editorConfig.uploadUrl = this.routesService.getRootUrlImage(this.editorialRouteName);
  }

  ngOnDestroy(): void {
    clearInterval(this.autoSaveInterval);
  }

  get f() {
    return this.editorialForm.controls;
  }

  initEditorial(editorial: Routes) {
    this.editorial = JSON.parse(editorial.content);
    this.initForm();
    this.autoSaveExec();
    this.initialized = true;
  }

  initForm() {
    this.resetFormGroup();
    let i = 0;
    for (const tab of this.editorial) {
      const titleFormName = this.titleKey + i;
      const contentFormName = this.contentKey + i;
      this.editorialForm.addControl(titleFormName, new FormControl('', [Validators.maxLength(150)]));
      this.editorialForm.addControl(contentFormName,
        new FormControl('', [Validators.maxLength((2 * 1024 * 1024 * 1024) / 4)]));
      // Length max of PHP string with UTF-8 char : max 4B, PHP max size: 2GB
      this.f[titleFormName].setValue(tab.title);
      this.f[contentFormName].setValue(tab.content);
      i++;
    }
  }

  resetFormGroup() {
    this.editorialForm = new FormGroup({
      titleForm: new FormControl('', [Validators.maxLength(255)]),
    });
  }

  saveEditorial(quit: boolean) {
    this.updateEditorialInstance();
    this.routesService.updateRouteByName(this.editorialRouteName, JSON.stringify(this.editorial), this.locale, !quit)
      .subscribe({
        next: () => this.navigateToConsult(quit)
      });
  }

  addTab() {
    let title = 'Sans titre';
    const content = 'Sans contenu';

    if (Object.values(this.editorialForm.value).indexOf(title) > -1) {
      let i = 1;
      let genTitle = title + ' ' + i;
      while (Object.values(this.editorialForm.value).indexOf(genTitle) > -1) {
        genTitle = title + ' ' + i;
        i += 1;
      }
      title = genTitle;
    }

    this.updateEditorialInstance(new EditorialTabContent(title, content));
    this.initForm();
  }

  removeTab(index: number) {
    const confirmDialogRef = this.confirmDialog.open(ConfirmDialogComponent,
      { data: { title: 'info.continue?', message: 'editorial.remove' } });
    confirmDialogRef.afterClosed().subscribe({
      next: (result) => {
        if (result) {
          this.editorialForm.removeControl(this.titleKey + index);
          this.editorialForm.removeControl(this.contentKey + index);

          this.updateEditorialInstance();
          this.initForm();
        }
      }
    });
  }

  private updateEditorialInstance(newtabContent?: EditorialTabContent) {
    const content: EditorialTabContent[] = [];
    for (const [formName, formValue] of Object.entries(this.editorialForm.value)) {
      if (formName.startsWith(this.titleKey)) {
        const tabTitle = formValue as string;
        const tabContent = this.f[this.contentKey + formName.replace(this.titleKey, '')].value;
        content.push(new EditorialTabContent(tabTitle, tabContent));
      }
    }
    this.editorial = content;
    if (newtabContent != null) {
      this.editorial.push(newtabContent);
    }
  }

  private navigateToConsult(quit: boolean) {
    if (quit) {
      this.canQuit.emit(true);
      this.router.navigate(['/editorials/global']);
    } else {
      this.lastSave = Date.now();
    }
  }

  private autoSaveExec() {
    this.autoSaveInterval = setInterval(() => {
      if (this.autoSave && this.editorialForm?.valid) {
        this.saveEditorial(false);
      }
    }, 60000); // 1 min
  }

}
