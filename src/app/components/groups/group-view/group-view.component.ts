import { Component, OnInit, Input, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Groups } from 'src/app/models/groups.model';
import { AdministrationTypes } from 'src/app/models/administration-types.model';
import { AdministrationTypesService } from 'src/app/services/administration-types.service';
import { TranslateService } from '@ngx-translate/core';
import { GroupsService, BodyGroups } from 'src/app/services/groups.service';
import { GroupNode } from 'src/app/common/group-node';
import { Lang } from 'src/app/common/lang.interface';
import { Translation } from 'src/app/common/translation.interface';

@Component({
  selector: 'app-group-view',
  templateUrl: './group-view.component.html',
  styleUrls: ['./group-view.component.scss']
})
export class GroupViewComponent implements OnInit, AfterViewChecked {

  @Input() allGroup: Groups[];
  @Input() group: Groups;
  @Input() nodes: GroupNode[];

  allGroupCopy: Groups[];
  langs: Lang[];
  tabLang: Lang[] = [];
  allAdminstrationType: AdministrationTypes[];
  administrationType: AdministrationTypes;
  groupTitle = new Map<string, string>();
  currentTitle: string;
  init = false;

  selectedTabIndex: number;

  groupForm = new FormGroup({
    administrationTypeForm: new FormControl('', [Validators.required]),
    parentGroupForm: new FormControl('', [Validators.required])
  });
  constructor(
    public esgbuService: ESGBUService,
    private adminTypesService: AdministrationTypesService,
    private translate: TranslateService,
    public groupService: GroupsService,
    private cdRef: ChangeDetectorRef
  ) { }

  get f() {
    return this.groupForm.controls;
  }

  ngOnInit() {
    if (this.group == null) {
      this.group = new Groups();
    }
    this.allGroupCopy = Object.assign([], this.allGroup);
    this.langs = this.esgbuService.AVAILABLE_LANG;
    this.removeChild(this.group.id, this.allGroupCopy);
    this.adminTypesService.getAllTypes().subscribe({
      next: (response) => this.allAdminstrationType = response
    });
    for (const lang of this.langs) {
      const validators = [Validators.maxLength(65535)];
      if (lang.language === this.esgbuService.DEFAULT_LANG) {
        validators.push(Validators.required);
      }
      const formControl = new FormControl('', validators);
      this.groupForm.addControl(lang.language, formControl);
    }
  }

  ngAfterViewChecked() {
    if (!this.init) {
      this.loadTitle(this.tabLang[0]);
      this.loadOtherGroupInfo();
      this.focusCurrentLangTab();
      this.init = true;
    }
    this.cdRef.detectChanges();
  }

  getTabLabel(index: number, lang: Lang) {
    this.tabLang[index] = lang;
    return 'app.langName.' + lang.language;
  }

  onChangeTab(event: MatTabChangeEvent) {
    const lang: Lang = this.tabLang[event.index];
    this.loadTitle(lang);
  }

  updateAdministrationTypeIndex(event) {
    this.administrationType = event.value;
    if (event != null) {
      this.f.parentGroupForm.enable();
    }
    this.f.parentGroupForm.reset();
  }

  getNewValues(): BodyGroups {
    const parentGroupFormValue = this.f.parentGroupForm.value;
    this.group.parentGroupId = (parentGroupFormValue === 'root') ? null : parentGroupFormValue.id;

    this.group.administrationType = this.f.administrationTypeForm.value;

    const controlNames = Object.keys(this.groupForm.controls);
    const translations: Translation[] = [];
    for (const controlName of controlNames) {
      if (!this.esgbuService.AVAILABLE_LANG.find((el) => el.language === controlName)) {
        continue;
      }
      const control = this.groupForm.get(controlName);
      const oldGroupTitle = this.groupTitle[controlName];

      if (control.value !== oldGroupTitle && control.value) {
        const translation = { lang: controlName, value: control.value };
        translations.push(translation);
      }
    }

    return {
      administrationTypeId: this.group.administrationType.id,
      parentGroupId: this.group.parentGroupId,
      titles: translations
    };
  }

  compareObjects(o1: any, o2: any): boolean {
    if (typeof (o1) === 'string') {
      return o1 === o2;
    } else {
      const o1group = new Groups(o1);
      const o2group = new Groups(o2);
      if (o1group.equals(o2group)) {
        return true;
      }
      const o1AdminType = new AdministrationTypes(o1);
      const o2AdminType = new AdministrationTypes(o2);
      if (o1AdminType.equals(o2AdminType)) {
        return true;
      }
    }
    return false;
  }

  private loadTitle(lang: Lang) {
    if (this.group.id == null) {
      return;
    }

    const existTitle = this.groupTitle[lang.language];
    if (existTitle != null) {
      this.currentTitle = existTitle;
      return;
    }

    if (this.translate.getDefaultLang() === lang.language) {
      this.initParameterAfterLoad(this.group, lang);
    } else {
      this.groupService.getGroup(this.group.id, lang.language).subscribe({
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

  private loadOtherGroupInfo() {
    if (this.group.id == null) {
      this.f.parentGroupForm.disable();
      return;
    }

    this.administrationType = this.group.administrationType;
    this.groupForm.controls.administrationTypeForm.setValue(this.administrationType);

    if (this.group.parentGroupId == null) {
      this.groupForm.controls.parentGroupForm.setValue('root');
    } else {
      for (const otherGroup of this.allGroupCopy) {
        if (otherGroup.id === this.group.parentGroupId) {
          this.groupForm.controls.parentGroupForm.setValue(otherGroup);
          break;
        }
      }
    }
  }

  private initParameterAfterLoad(group: Groups, lang: Lang) {
    if (group != null) {
      this.currentTitle = group.title;
    }

    this.groupTitle[lang.language] = this.currentTitle;
    if (this.currentTitle != null) {
      this.groupForm.get(lang.language).setValue(this.currentTitle);
    }
  }

  private removeChild(groupId: number, allGroups: Groups[]) {
    let i = 0;
    for (const group of allGroups) {
      if (group.parentGroupId === groupId && group.administrationType.id === this.group.administrationType.id) {
        this.removeChild(group.id, allGroups);
        allGroups.splice(i, 1);
      }
      i++;
    }
  }

  private focusCurrentLangTab() {
    for (const [index, lang] of this.tabLang.entries()) {
      if (lang.language === this.translate.getDefaultLang()) {
        this.selectedTabIndex = index;
      }
    }
  }

}
