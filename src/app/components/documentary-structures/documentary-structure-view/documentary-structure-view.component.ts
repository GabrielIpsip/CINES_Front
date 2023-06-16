import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { EstablishmentsService } from 'src/app/services/establishments.service';
import { Establishments } from 'src/app/models/establishments.model';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { DocumentaryStructureEstablishmentSearchDialogComponent } from '../documentary-structure-establishment-search-dialog/documentary-structure-establishment-search-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatInput } from '@angular/material/input';
import { Departments } from 'src/app/models/departments.model';
import { DepartmentsService } from 'src/app/services/departments.service';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-documentary-structure-view',
  templateUrl: './documentary-structure-view.component.html',
  styleUrls: ['./documentary-structure-view.component.scss']
})
export class DocumentaryStructureViewComponent implements OnInit {

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;

  @Input() docStruct: DocumentaryStructures;

  statusList: Map<string, boolean>;
  active: boolean;
  establishment: Establishments;
  private departmentId: number;
  departments: Departments[];

  docStructForm: FormGroup = new FormGroup({
    officialNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    useNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    acronymForm: new FormControl('', [Validators.maxLength(50)]),
    addressForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    cityForm: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    postalCodeForm: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern('^[0-9]{5}$')]),
    departmentForm: new FormControl('', [Validators.required]),
    websiteForm: new FormControl('', [Validators.required,
    Validators.pattern('https?://([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?')]),
    establishmentForm: new FormControl('', [Validators.required]),
    instructionForm: new FormControl('', [Validators.maxLength(65535)])
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
    private establishmentsService: EstablishmentsService,
    public dialog: MatDialog,
    private departmentsService: DepartmentsService
  ) { }

  get f() {
    return this.docStructForm.controls;
  }

  get currentDepartment(): Departments {
    if (this.departmentId == null) {
      return this.docStruct.department;
    } else {
      return this.departments.find((el) => el.id === this.departmentId);
    }
  }

  ngOnInit() {
    this.docStructForm.controls.establishmentForm.disable();
    this.statusList = new Map<string, boolean>();

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

    this.updateEstablishmentForm();
    this.docStructForm.controls.officialNameForm.setValue(this.docStruct.officialName);
    this.docStructForm.controls.useNameForm.setValue(this.docStruct.useName);
    this.docStructForm.controls.acronymForm.setValue(this.docStruct.acronym);
    this.docStructForm.controls.addressForm.setValue(this.docStruct.address);
    this.docStructForm.controls.cityForm.setValue(this.docStruct.city);
    this.docStructForm.controls.postalCodeForm.setValue(this.docStruct.postalCode);
    this.docStructForm.controls.departmentForm.setValue(this.docStruct.department.id);
    this.docStructForm.controls.websiteForm.setValue(this.docStruct.website);
    this.docStructForm.controls.instructionForm.setValue(this.docStruct.instruction);
    this.active = (this.docStruct.active != null) ? this.docStruct.active : true;
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

  updateEstablishmentForm() {
    if (this.docStruct.establishmentId) {
      this.establishmentsService.getEstablishment(this.docStruct.establishmentId).subscribe({
        next: (response) => {
          this.establishment = response;
          this.updateInputEstablishmentText(this.establishment.useName);
        }
      });
    }
  }

  updateInputEstablishmentText(useName: string) {
    this.docStructForm.controls.establishmentForm.enable();
    this.docStructForm.controls.establishmentForm.setValue(useName);
    this.docStructForm.controls.establishmentForm.disable();
  }

  getNewValues(): DocumentaryStructures {

    this.docStruct.officialName = this.docStructForm.controls.officialNameForm.value;
    this.docStruct.useName = this.docStructForm.controls.useNameForm.value;
    this.docStruct.acronym = this.docStructForm.controls.acronymForm.value;
    this.docStruct.address = this.docStructForm.controls.addressForm.value;
    this.docStruct.city = this.docStructForm.controls.cityForm.value;
    this.docStruct.postalCode = this.docStructForm.controls.postalCodeForm.value;
    this.docStruct.department = this.currentDepartment;
    this.docStruct.website = this.docStructForm.controls.websiteForm.value;
    this.docStruct.instruction = this.docStructForm.controls.instructionForm.value;
    this.docStruct.active = this.active;
    this.docStruct.establishmentId = this.establishment.id;

    return this.docStruct;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DocumentaryStructureEstablishmentSearchDialogComponent, {
      data: this.establishment
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.establishment = result;
        this.updateInputEstablishmentText(this.establishment.useName);
      }
    });
  }

  isValid(): boolean {
    return this.docStructForm.valid && this.establishment != null;
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

}
