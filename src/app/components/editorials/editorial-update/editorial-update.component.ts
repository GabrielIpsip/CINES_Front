import { AfterContentChecked, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmBeforeQuit } from 'src/app/guards/confirm-before-quit.guard';
import { Editorials, EditorialTabContent } from 'src/app/models/editorials.model';
import { EditorialsService } from 'src/app/services/editorials.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-editorial-update',
  templateUrl: './editorial-update.component.html',
  styleUrls: ['./editorial-update.component.scss']
})
export class EditorialUpdateComponent implements OnInit, AfterContentChecked, OnDestroy, ConfirmBeforeQuit {

  editorial: Editorials;
  surveyId: number;

  autoSaveInterval: any;

  lastSave: number;
  autoSave = true;

  titleKey = '#<title>#-';
  contentKey = '#<content>#-';
  editorialForm: FormGroup;

  initialized = false;

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
    uploadWithCredentials: false,
    sanitize: false,
    toolbarPosition: 'top',
    toolbarHiddenButtons: [
      ['insertVideo']
    ]
  };

  constructor(
    private editorialsService: EditorialsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private translate: TranslateService,
    private confirmDialog: MatDialog
  ) { }

  ngOnInit() {
    this.surveyId = +this.activatedRoute.snapshot.params.id;
    this.resetFormGroup();

    this.editorialsService.getEditorial(this.surveyId).subscribe({
      next: (response) => this.initEditorial(new Editorials(response)),
      error: (error) => {
        if (error.status === 404) {
          this.editorialsService.createEditorial(this.surveyId, new Editorials()).subscribe({
            next: (response) => this.initEditorial(new Editorials(response))
          });
        }
      }
    });
  }

  ngAfterContentChecked() {
    this.editorConfig.uploadUrl = this.editorialsService.getRootUrlImage(this.surveyId);
  }

  ngOnDestroy() {
    clearInterval(this.autoSaveInterval);
  }

  initEditorial(editorial: Editorials) {
    this.editorial = editorial;
    this.initForm();
    this.autoSaveExec();
    this.initialized = true;
  }

  get f() {
    return this.editorialForm.controls;
  }

  get locale() {
    return this.translate.getDefaultLang();
  }

  private updateEditorialInstance(newtabContent?: EditorialTabContent) {
    this.editorial.title = this.f.titleForm.value;
    const content: EditorialTabContent[] = [];
    for (const [formName, formValue] of Object.entries(this.editorialForm.value)) {
      if (formName.startsWith(this.titleKey)) {
        const tabTitle = formValue as string;
        const tabContent = this.f[this.contentKey + formName.replace(this.titleKey, '')].value;
        content.push(new EditorialTabContent(tabTitle, tabContent));
      }
    }
    this.editorial.content = content;
    if (newtabContent != null) {
      this.editorial.content.push(newtabContent);
    }
  }

  saveEditorial(quit: boolean) {
    this.updateEditorialInstance();
    this.editorialsService.updateEditorial(this.surveyId, this.editorial, !quit).subscribe({
      next: (response) => this.navigateToConsult(quit, response.survey.id)
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

  initForm() {
    this.resetFormGroup();
    this.f.titleForm.setValue(this.editorial.title);
    let i = 0;
    for (const tab of this.editorial.content) {
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

  resetFormGroup() {
    this.editorialForm = new FormGroup({
      titleForm: new FormControl('', [Validators.maxLength(255)]),
    });
  }

  private navigateToConsult(quit: boolean, surveyId: number) {
    if (quit) {
      this.canQuit = true;
      this.router.navigate(['/editorials/' + surveyId]);
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
