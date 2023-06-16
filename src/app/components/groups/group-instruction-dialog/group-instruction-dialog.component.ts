import { Component, OnInit, Inject, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { Groups } from 'src/app/models/groups.model';
import { GroupInstructionsService } from 'src/app/services/group-instructions.service';
import { GroupInstructions } from 'src/app/models/group-instructions.model';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Surveys } from 'src/app/models/surveys.model';
import { SurveysService } from 'src/app/services/surveys.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Lang } from 'src/app/common/lang.interface';
import { Translation } from 'src/app/common/translation.interface';

@Component({
  selector: 'app-group-instruction-dialog',
  templateUrl: './group-instruction-dialog.component.html',
  styleUrls: ['./group-instruction-dialog.component.scss']
})
export class GroupInstructionDialogComponent implements OnInit, AfterViewChecked {

  langs: Lang[];
  groupInstruction = new Map<string, GroupInstructions>();
  tabLang = new Map<number, Lang>();
  survey: Surveys;
  init = false;
  currentInstruction: GroupInstructions;
  groupId: number;
  alreadyLoadedInstruction: GroupInstructions;
  group: Groups;

  instructionGroupForm = new FormGroup({});

  constructor(
    public dialogRef: MatDialogRef<GroupInstructionDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { groupInstruction: GroupInstructions, group: Groups },
    private esgbuService: ESGBUService,
    private groupInstructionService: GroupInstructionsService,
    private surveysService: SurveysService,
    private cdRef: ChangeDetectorRef,
    private translate: TranslateService
  ) { }

  ngOnInit() {
    this.groupId = this.data.group.id;
    this.alreadyLoadedInstruction = this.data.groupInstruction;
    this.langs = this.esgbuService.AVAILABLE_LANG;
    this.survey = this.surveysService.getStoredSurvey();
    for (const lang of this.langs) {
      const formControl = new FormControl('', [Validators.maxLength(65535)]);
      this.instructionGroupForm.addControl(lang.language, formControl);
    }
  }

  ngAfterViewChecked() {
    if (!this.init) {
      this.loadInstruction(this.tabLang[0]);
      this.init = true;
    }
    this.cdRef.detectChanges();
  }

  getTabLabel(index: number, lang: Lang) {
    this.tabLang[index] = lang;
    return 'app.langName.' + lang.language;
  }

  loadInstruction(lang: Lang) {
    const existInstruction = this.groupInstruction[lang.language];
    if (existInstruction != null) {
      this.currentInstruction = existInstruction;
      return;
    }

    if (this.translate.getDefaultLang() === lang.language) {
      this.initParameterAfterLoad(this.alreadyLoadedInstruction, lang);
    } else {
      this.groupInstructionService.getInstruction(this.groupId, this.survey.id, lang.language).subscribe({
        next: (response) => {
          this.initParameterAfterLoad(response, lang);
        },
        error: (error) => {
          if (error.status === 404) {
            this.initParameterAfterLoad(null, lang);
          }
        }
      });
    }
  }

  private initParameterAfterLoad(instruction: GroupInstructions, lang: Lang) {
    if (instruction == null) {
      this.currentInstruction = new GroupInstructions(this.groupId, this.survey.id, null);
    } else {
      this.currentInstruction = instruction;
    }

    this.groupInstruction[lang.language] = this.currentInstruction;
    if (this.currentInstruction.instruction != null) {
      this.instructionGroupForm.get(lang.language).setValue(this.currentInstruction.instruction);
    }
  }

  onChangeTab(event: MatTabChangeEvent) {
    const lang: Lang = this.tabLang[event.index];
    this.loadInstruction(lang);
  }

  onNoClick() {
    this.dialogRef.close();
  }

  onApplyClick() {
    const controlNames = Object.keys(this.instructionGroupForm.controls);
    const translations: Translation[] = [];
    for (const controlName of controlNames) {
      const control = this.instructionGroupForm.get(controlName);
      const oldGroupInstruction = this.groupInstruction[controlName];
      const oldInstruction = oldGroupInstruction ? oldGroupInstruction.instruction : '';

      if (control.value !== oldInstruction) {
        const translation = { lang: controlName, value: control.value };
        translations.push(translation);
      }
    }

    if (this.alreadyLoadedInstruction == null) {
      this.createInstructionAndCloseDialog(translations);
    } else {
      this.updateInstructionAndCloseDialog(translations);
    }
  }

  private updateInstructionAndCloseDialog(translations: Translation[]) {
    this.groupInstructionService
      .updateInstruction(this.groupId, this.survey.id, translations).subscribe({
        next: (response) => this.dialogRef.close(response)
      });
  }

  private createInstructionAndCloseDialog(translations: Translation[]) {
    this.groupInstructionService
      .createInstruction(this.groupId, this.survey.id, translations).subscribe({
        next: (response) => this.dialogRef.close(response)
      });
  }
}
