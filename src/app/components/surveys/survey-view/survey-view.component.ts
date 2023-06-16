import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { Surveys } from 'src/app//models/surveys.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { StatesService } from 'src/app/services/states.service';
import { States } from 'src/app/models/states.model';
import { MatOptionSelectionChange } from '@angular/material/core';
import { TranslateService } from '@ngx-translate/core';
import { DateTools } from 'src/app/utils/date-tools';
import { DatePipe } from '@angular/common';
import { strMaxValidator } from 'src/app/validators/str-max.validators';
import { strMinValidator } from 'src/app/validators/str-min.validators';
import { StringTools } from 'src/app/utils/string-tools';
import { StatesEnum } from 'src/app/common/statesEnum.enum';
import { DateAdapter } from '@angular/material/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-survey-view',
  templateUrl: './survey-view.component.html',
  styleUrls: ['./survey-view.component.scss']
})
export class SurveyViewComponent implements OnInit {

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() survey: Surveys;
  @Input() createMode: boolean;

  private stateIndex: number;
  states: States[];
  currentDate = new Date();
  lastYear = new Date();
  statesEnum = StatesEnum;
  locale: string;

  surveyForm: FormGroup = new FormGroup({
    nameForm: new FormControl('', [Validators.required, Validators.maxLength(100)]),
    calendarYearForm: new FormControl(''),
    dataCalendarYearForm: new FormControl(''),
    startForm: new FormControl('', [Validators.required]),
    endForm: new FormControl('', [Validators.required]),
    instructionForm: new FormControl('', [Validators.maxLength(65535)]),
    stateForm: new FormControl('', [Validators.required])
  });

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
      ['insertImage', 'insertVideo']
    ]
  };

  constructor(
    private stateService: StatesService,
    private dateAdapter: DateAdapter<any>,
    private datePipe: DatePipe,
    private translate: TranslateService
  ) { }

  get f() {
    return this.surveyForm.controls;
  }

  ngOnInit() {
    this.locale = this.translate.getDefaultLang();
    this.dateAdapter.setLocale(this.locale);
    this.lastYear.setFullYear(this.currentDate.getFullYear() - 1);
    this.stateService.getAllStates().subscribe(response => {
      this.states = response;
      this.initializeCreateMode();
    });

    const dateTools = new DateTools(this.datePipe);
    this.surveyForm.controls.nameForm.setValue(this.survey.name);
    this.surveyForm.controls.calendarYearForm.setValue(dateTools.strToYear(this.survey.calendarYear));
    this.surveyForm.controls.dataCalendarYearForm.setValue(dateTools.strToYear(this.survey.dataCalendarYear));
    this.surveyForm.controls.startForm.setValue(dateTools.strToDate(this.survey.start));
    this.surveyForm.controls.endForm.setValue(dateTools.strToDate(this.survey.end));
    this.surveyForm.controls.instructionForm.setValue(this.survey.instruction);

    if (this.survey.state?.id) {
      this.surveyForm.controls.stateForm.setValue(this.survey.state.id);
    }

    this.updateValidators();
  }

  initializeCreateMode() {
    if (this.createMode) {
      for (const state of this.states) {
        if (state.name === this.statesEnum.created) {
          this.survey.state = state;
          this.surveyForm.controls.stateForm.setValue(state.id);
          this.surveyForm.controls.stateForm.disable();
          return;
        }
      }
    }
  }

  getNewValues(): Surveys {
    const newState: States = this.states[this.stateIndex - 1];

    if (newState) {
      this.survey.state = newState;
    }

    this.survey.name = this.surveyForm.controls.nameForm.value;
    this.survey.calendarYear = this.surveyForm.controls.calendarYearForm.value;
    this.survey.dataCalendarYear = this.surveyForm.controls.dataCalendarYearForm.value;
    this.survey.start = this.datePipe.transform(this.surveyForm.controls.startForm.value, 'yyyy-MM-dd hh:mm:ssz');
    this.survey.end = this.datePipe.transform(this.surveyForm.controls.endForm.value, 'yyyy-MM-dd hh:mm:ssz');
    this.survey.instruction = this.surveyForm.controls.instructionForm.value;

    return this.survey;
  }

  updateValidators() {
    const locale = this.translate.getDefaultLang();
    const calendarYearValue = StringTools.strToNumber(
      this.surveyForm.controls.calendarYearForm.value, false, locale);
    const dataCalendarYearValue = StringTools.strToNumber(
      this.surveyForm.controls.dataCalendarYearForm.value, false, locale);

    this.surveyForm.controls.calendarYearForm
      .setValidators([Validators.required,
      Validators.pattern('^[0-9]{4}$'),
      strMinValidator(dataCalendarYearValue, locale)]);

    this.surveyForm.controls.dataCalendarYearForm
      .setValidators([Validators.required,
      Validators.pattern('^[0-9]{4}$'),
      strMaxValidator(calendarYearValue, locale)]);

    this.surveyForm.controls.calendarYearForm.updateValueAndValidity();
    this.surveyForm.controls.dataCalendarYearForm.updateValueAndValidity();
  }

  updateStateIndex(event: MatOptionSelectionChange) {
    this.stateIndex = event.source.value;
  }

  onKeyDown(event: any) {

    if (event.key !== 'Enter') {
      return;
    }

    const inputId = event.target.id;
    if (!inputId) {
      return;
    }

    event.preventDefault();

    const inputArray = this.inputs.toArray();
    let nextIndex = 0;

    this.inputs.find((el: MatInput, i: number) => {
      nextIndex = i + 1;
      return el.id === inputId;
    });

    if (nextIndex >= this.inputs.length) {
      nextIndex = 0;
    }

    let nextElement = inputArray[nextIndex];
    if (nextElement.disabled) {
      nextElement = inputArray[0];
    }

    nextElement.focus();
  }

}
