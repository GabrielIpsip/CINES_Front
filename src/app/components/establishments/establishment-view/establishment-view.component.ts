import { Establishments } from './../../../models/establishments.model';
import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { EstablishmentTypes } from 'src/app/models/establishment-types.model';
import { EstablishmentTypesService } from 'src/app/services/establishment-types.service';
import { MatOptionSelectionChange } from '@angular/material/core';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatInput } from '@angular/material/input';
import { DepartmentsService } from 'src/app/services/departments.service';
import { Departments } from 'src/app/models/departments.model';

@Component({
  selector: 'app-establishment-view',
  templateUrl: './establishment-view.component.html',
  styleUrls: ['./establishment-view.component.scss']
})
export class EstablishmentViewComponent implements OnInit {

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() establishment: Establishments;

  private typeIndex: number;
  private departmentId: number;

  types: EstablishmentTypes[];
  departments: Departments[];
  statusList: Map<string, boolean>;
  active: boolean;

  establishmentForm: FormGroup = new FormGroup({
    officialNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    useNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    acronymForm: new FormControl('', [Validators.maxLength(50)]),
    brandForm: new FormControl('', [Validators.maxLength(150)]),
    addressForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    cityForm: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    postalCodeForm: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern('^[0-9]{5}$')]),
    departmentForm: new FormControl('', [Validators.required]),
    websiteForm: new FormControl('', [Validators.required,
    Validators.pattern('https?://([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
    typeForm: new FormControl('', [Validators.required]),
    instructionForm: new FormControl('', [Validators.maxLength(65535)]),
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
    private translate: TranslateService,
    private establishmentTypesService: EstablishmentTypesService,
    private departmentsService: DepartmentsService
  ) { }

  get f() {
    return this.establishmentForm.controls;
  }

  get currentDepartment(): Departments {
    if (this.departmentId == null) {
      return this.establishment.department;
    } else {
      return this.departments.find((el) => el.id === this.departmentId);
    }
  }

  ngOnInit() {
    this.statusList = new Map<string, boolean>();

    this.establishmentTypesService.getAllTypes().subscribe({
      next: (response) => this.types = response
    });

    this.departmentsService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.sort((a, b) => {
          return parseInt(a.code, 10) - parseInt(b.code, 10);
        });
      }
    });

    this.translate.onLangChange.subscribe(() => {
      this.statusList = new Map<string, boolean>();
    });

    this.translate.stream('establishment.view.enabled')
      .subscribe((val: string) => this.statusList.set(val, true));

    this.translate.stream('establishment.view.disabled')
      .subscribe((val: string) => this.statusList.set(val, false));

    this.establishmentForm.controls.officialNameForm.setValue(this.establishment.officialName);
    this.establishmentForm.controls.useNameForm.setValue(this.establishment.useName);
    this.establishmentForm.controls.acronymForm.setValue(this.establishment.acronym);
    this.establishmentForm.controls.brandForm.setValue(this.establishment.brand);
    this.establishmentForm.controls.addressForm.setValue(this.establishment.address);
    this.establishmentForm.controls.cityForm.setValue(this.establishment.city);
    this.establishmentForm.controls.postalCodeForm.setValue(this.establishment.postalCode);
    this.establishmentForm.controls.departmentForm.setValue(this.establishment.department.id);
    this.establishmentForm.controls.websiteForm.setValue(this.establishment.website);
    this.establishmentForm.controls.instructionForm.setValue(this.establishment.instruction);
    this.active = (this.establishment.active != null) ? this.establishment.active : true;

    if (this.establishment.type.id) {
      this.establishmentForm.controls.typeForm.setValue(this.establishment.type.id);
    }
  }

  getNewValues(): Establishments {
    const newType: EstablishmentTypes = this.types[this.typeIndex - 1];

    if (newType) {
      this.establishment.type = newType;
    }

    this.establishment.officialName = this.establishmentForm.controls.officialNameForm.value;
    this.establishment.useName = this.establishmentForm.controls.useNameForm.value;
    this.establishment.acronym = this.establishmentForm.controls.acronymForm.value;
    this.establishment.brand = this.establishmentForm.controls.brandForm.value;
    this.establishment.address = this.establishmentForm.controls.addressForm.value;
    this.establishment.city = this.establishmentForm.controls.cityForm.value;
    this.establishment.postalCode = this.establishmentForm.controls.postalCodeForm.value;
    this.establishment.department = this.currentDepartment;
    this.establishment.website = this.establishmentForm.controls.websiteForm.value;
    this.establishment.instruction = this.establishmentForm.controls.instructionForm.value;
    this.establishment.active = this.active;

    return this.establishment;
  }

  updateTypeIndex(event: MatOptionSelectionChange) {
    this.typeIndex = event.source.value;
  }

  updateDepartmentId(event: MatOptionSelectionChange) {
    this.departmentId = event.source.value;
  }

  onChangePostalCode() {
    const postalCode = this.f.postalCodeForm.value;
    if (postalCode.length !== 5) {
      return;
    }
    this.departmentsService.getDepartmentByPostalCode(postalCode).subscribe({
      next: (response) => {
        this.departmentId = response.id;
        this.f.departmentForm.setValue(this.departmentId);
      },
      error: () => { /* Do Nothing */ }
    });
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
