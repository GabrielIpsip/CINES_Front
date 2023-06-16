import { ChangeDetectorRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { AfterViewChecked, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import { JsonEditorOptions, JsonEditorComponent } from 'ang-jsoneditor';
import { Lang } from 'src/app/common/lang.interface';
import { Translation } from 'src/app/common/translation.interface';
import { Indicators } from 'src/app/models/broadcast/indicators.model';
import { BodyIndicators, IndicatorsService } from 'src/app/services/broadcast/indicators.service';
import { EsgbuApiService } from 'src/app/services/esgbu-api.service';
import { ESGBUService } from 'src/app/services/esgbu.service';

@Component({
  selector: 'app-indicator-view',
  templateUrl: './indicator-view.component.html',
  styleUrls: ['./indicator-view.component.scss']
})
export class IndicatorViewComponent implements OnInit, AfterViewChecked {

  @Input() indicator: Indicators;
  @Output() initialValueEmitter = new EventEmitter<BodyIndicators>();

  langs: Lang[];
  tabLang: Lang[] = [];

  indicatorNames = new Map<string, string>();
  indicatorDescriptions = new Map<string, string>();

  indicatorTranslatableField = new Map<string, Map<string, string>>([
    ['names', this.indicatorNames],
    ['descriptions', this.indicatorDescriptions]
  ]);

  currentName: string;
  currentDescription: string;

  selectedTabIndex: number;

  init = false;

  public editorOptions: JsonEditorOptions;
  @ViewChild(JsonEditorComponent, { static: false }) editor: JsonEditorComponent;

  indicatorForm = new FormGroup({
    byRegionForm: new FormControl('', [Validators.required]),
    byEstablishmentForm: new FormControl('', [Validators.required]),
    byDocStructForm: new FormControl('', [Validators.required]),
    globalForm: new FormControl('', [Validators.required]),
    keyFigureForm: new FormControl('', [Validators.required]),
    activeForm: new FormControl('', [Validators.required]),
    displayOrderForm: new FormControl('', [Validators.required, Validators.min(1)]),
    administratorForm: new FormControl('', [Validators.required]),
    prefixForm: new FormControl('', [Validators.maxLength(10)]),
    suffixForm: new FormControl('', [Validators.maxLength(10)]),
    queryForm: new FormControl(''),
  });

  constructor(
    public esgbuService: ESGBUService,
    private translate: TranslateService,
    private indicatorsService: IndicatorsService,
    private cdRef: ChangeDetectorRef,
    private esgbuApiService: EsgbuApiService<any>
  ) { }

  get f() {
    return this.indicatorForm.controls;
  }

  get getApiUrl(): string {
    return this.esgbuApiService.baseApiUrl;
  }

  ngOnInit() {
    if (this.indicator == null) {
      this.indicator = new Indicators();
    }

    this.langs = this.esgbuService.AVAILABLE_LANG;

    for (const [field] of this.indicatorTranslatableField) {
      for (const lang of this.langs) {
        const validators = [Validators.maxLength(65535)];
        if (field === 'names' && lang.language === this.esgbuService.DEFAULT_LANG) {
          validators.push(Validators.required);
        }
        const formControl = new FormControl('', validators);
        this.indicatorForm.addControl(field + '_' + lang.language, formControl);
      }
    }

    this.initJsonEditor();
  }

  ngAfterViewChecked() {
    if (!this.init) {
      this.loadTranslatedField(this.tabLang[0]);
      this.loadOtherIndicatorInfo();
      this.focusCurrentLangTab();
      this.init = true;
      this.initialValueEmitter.emit(this.getNewValues());
    }
    this.cdRef.detectChanges();
  }

  private initJsonEditor() {
    this.editorOptions = new JsonEditorOptions();
    this.editorOptions.mode = 'code';
  }

  getTabLabel(index: number, lang: Lang) {
    this.tabLang[index] = lang;
    return 'app.langName.' + lang.language;
  }

  onChangeTab(event: MatTabChangeEvent) {
    const lang: Lang = this.tabLang[event.index];
    this.loadTranslatedField(lang);
  }

  private loadTranslatedField(lang: Lang) {
    if (this.indicator.id == null) {
      return;
    }

    const existName = this.indicatorNames[lang.language];
    const existDescription = this.indicatorDescriptions[lang.language];

    if (existName != null || existDescription != null) {
      this.currentName = existName;
      this.currentDescription = existDescription;
      return;
    }

    if (this.translate.getDefaultLang() === lang.language) {
      this.initParameterAfterLoad(this.indicator, lang);
    } else {
      this.indicatorsService.getIndicator(this.indicator.id, null, false, true, lang.language).subscribe({
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

  private initParameterAfterLoad(indicator: Indicators, lang: Lang) {
    if (indicator != null) {
      this.currentName = indicator.name;
      this.currentDescription = indicator.description;
    }

    this.indicatorNames[lang.language] = this.currentName;
    this.indicatorDescriptions[lang.language] = this.currentDescription;

    if (this.currentName != null) {
      this.indicatorForm.get('names_' + lang.language).setValue(this.currentName);
    }

    if (this.currentDescription != null) {
      this.indicatorForm.get('descriptions_' + lang.language).setValue(this.currentDescription);
    }
  }

  private loadOtherIndicatorInfo() {

    if (this.indicator.id == null) {
      this.f.byRegionForm.setValue(false);
      this.f.byEstablishmentForm.setValue(false);
      this.f.byDocStructForm.setValue(false);
      this.f.globalForm.setValue(false);
      this.f.keyFigureForm.setValue(false);
      this.f.activeForm.setValue(false);
      this.f.displayOrderForm.setValue(1);
      this.f.administratorForm.setValue(false);
      this.f.prefixForm.setValue(null);
      this.f.suffixForm.setValue(null);
      this.f.queryForm.setValue(null);
      return;
    }

    this.f.byRegionForm.setValue(this.indicator.byRegion);
    this.f.byEstablishmentForm.setValue(this.indicator.byEstablishment);
    this.f.byDocStructForm.setValue(this.indicator.byDocStruct);
    this.f.globalForm.setValue(this.indicator.global);
    this.f.keyFigureForm.setValue(this.indicator.keyFigure);
    this.f.activeForm.setValue(this.indicator.active);
    this.f.displayOrderForm.setValue(this.indicator.displayOrder);
    this.f.administratorForm.setValue(this.indicator.administrator);
    this.f.prefixForm.setValue(this.indicator.prefix);
    this.f.suffixForm.setValue(this.indicator.suffix);
    this.f.queryForm.setValue(this.indicator.query);
  }

  private focusCurrentLangTab() {
    for (const [index, lang] of this.tabLang.entries()) {
      if (lang.language === this.translate.getDefaultLang()) {
        this.selectedTabIndex = index;
      }
    }
  }

  getNewValues(): BodyIndicators {
    const indicator = {} as BodyIndicators;
    indicator.byRegion = this.f.byRegionForm.value;
    indicator.byEstablishment = this.f.byEstablishmentForm.value;
    indicator.byDocStruct = this.f.byDocStructForm.value;
    indicator.global = this.f.globalForm.value;
    indicator.keyFigure = this.f.keyFigureForm.value;
    indicator.active = this.f.activeForm.value;
    indicator.displayOrder = this.f.displayOrderForm.value;
    indicator.administrator = this.f.administratorForm.value;
    indicator.prefix = this.f.prefixForm.value;
    indicator.suffix = this.f.suffixForm.value;
    indicator.query = this.f.queryForm.value;

    const controlNames = Object.keys(this.f);

    for (const [field] of this.indicatorTranslatableField) {
      const translations: Translation[] = [];

      for (const controlName of controlNames) {
        if (!this.esgbuService.AVAILABLE_LANG.find((el) => field + '_' + el.language === controlName)) {
          continue;
        }
        const control = this.indicatorForm.get(controlName);
        const langName = controlName.split('_')[1];
        const oldValue = this.indicatorTranslatableField.has(field)
          ? this.indicatorTranslatableField.get(field)[langName]
          : null;

        if ((oldValue != null && control.value !== oldValue) || control.value?.length > 0) {
          const translation = { lang: langName, value: control.value };
          translations.push(translation);
        }
      }

      indicator[field] = translations;
    }

    return indicator;
  }
}
