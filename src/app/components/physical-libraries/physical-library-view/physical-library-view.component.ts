import { Component, OnInit, Input, ViewChildren, QueryList } from '@angular/core';
import { PhysicalLibraries } from 'src/app/models/physical-libraries.model';
import { DocumentaryStructures } from 'src/app/models/documentary-structures.model';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { DocumentaryStructuresService } from 'src/app/services/documentary-structures.service';
import { MatDialog } from '@angular/material/dialog';
// tslint:disable-next-line: max-line-length
import { PhysicalLibraryDocStructSearchDialogComponent } from '../physical-library-doc-struct-search-dialog/physical-library-doc-struct-search-dialog.component';
import { AngularEditorConfig } from '@kolkov/angular-editor';
import { MatInput } from '@angular/material/input';
import { Departments } from 'src/app/models/departments.model';
import { DepartmentsService } from 'src/app/services/departments.service';
import { MatOptionSelectionChange } from '@angular/material/core';

@Component({
  selector: 'app-physical-library-view',
  templateUrl: './physical-library-view.component.html',
  styleUrls: ['./physical-library-view.component.scss'],
})
export class PhysicalLibraryViewComponent implements OnInit {

  @ViewChildren(MatInput) inputs: QueryList<MatInput>;
  @Input() physicLib: PhysicalLibraries;

  statusList: Map<string, boolean>;
  fictitiousList: Map<string, boolean>;
  active: boolean;
  fictitious: boolean;
  docStruct: DocumentaryStructures;

  private departmentId: number;
  departments: Departments[];

  physicLibForm: FormGroup = new FormGroup({
    officialNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    useNameForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    addressForm: new FormControl('', [Validators.required, Validators.maxLength(255)]),
    cityForm: new FormControl('', [Validators.required, Validators.maxLength(150)]),
    postalCodeForm: new FormControl('', [Validators.required, Validators.maxLength(5), Validators.minLength(5),
    Validators.pattern('^[0-9]{5}$')]),
    departmentForm: new FormControl('', [Validators.required]),
    instructionForm: new FormControl('', [Validators.maxLength(65535)]),
    sortOrderForm: new FormControl('', [Validators.min(1)]),
    docStructForm: new FormControl('', [Validators.required]),
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
    private docStructService: DocumentaryStructuresService,
    public dialog: MatDialog,
    private departmentsService: DepartmentsService
  ) { }

  get f() {
    return this.physicLibForm.controls;
  }

  get currentDepartment(): Departments {
    if (this.departmentId == null) {
      return this.physicLib.department;
    } else {
      return this.departments.find((el) => el.id === this.departmentId);
    }
  }

  ngOnInit() {
    this.physicLibForm.controls.docStructForm.disable();
    this.statusList = new Map<string, boolean>();
    this.fictitiousList = new Map<string, boolean>();

    this.departmentsService.getAllDepartments().subscribe({
      next: (response) => {
        this.departments = response.sort((a, b) => {
          return parseInt(a.code, 10) - parseInt(b.code, 10);
        });
      }
    });

    this.translate.stream('physicLib.view.enabled')
      .subscribe((val: string) => this.statusList.set(val, true));

    this.translate.stream('physicLib.view.disabled')
      .subscribe((val: string) => this.statusList.set(val, false));

    this.translate.stream('physicLib.view.physic')
      .subscribe((val: string) => this.fictitiousList.set(val, false));

    this.translate.stream('physicLib.view.fictitious')
      .subscribe((val: string) => this.fictitiousList.set(val, true));

    this.updateDocStructForm();
    this.physicLibForm.controls.officialNameForm.setValue(this.physicLib.officialName);
    this.physicLibForm.controls.useNameForm.setValue(this.physicLib.useName);
    this.physicLibForm.controls.addressForm.setValue(this.physicLib.address);
    this.physicLibForm.controls.cityForm.setValue(this.physicLib.city);
    this.physicLibForm.controls.postalCodeForm.setValue(this.physicLib.postalCode);
    this.physicLibForm.controls.departmentForm.setValue(this.physicLib.department.id);
    this.physicLibForm.controls.instructionForm.setValue(this.physicLib.instruction);
    this.physicLibForm.controls.sortOrderForm.setValue(this.physicLib.sortOrder);
    this.active = (this.physicLib.active != null) ? this.physicLib.active : true;
    this.fictitious = (this.physicLib.fictitious != null) ? this.physicLib.fictitious : false;

  }

  updateDocStructForm() {
    if (this.physicLib.docStructId) {
      this.docStructService.getDocStruct(this.physicLib.docStructId).subscribe({
        next: (response) => {
          this.docStruct = response;
          this.updateDocStructText(this.docStruct.useName);
        }
      });
    }
  }

  updateDocStructText(useName: string) {
    this.physicLibForm.controls.docStructForm.enable();
    this.physicLibForm.controls.docStructForm.setValue(useName);
    this.physicLibForm.controls.docStructForm.disable();
  }

  getNewValues(): PhysicalLibraries {
    this.physicLib.officialName = this.physicLibForm.controls.officialNameForm.value;
    this.physicLib.useName = this.physicLibForm.controls.useNameForm.value;
    this.physicLib.address = this.physicLibForm.controls.addressForm.value;
    this.physicLib.city = this.physicLibForm.controls.cityForm.value;
    this.physicLib.postalCode = this.physicLibForm.controls.postalCodeForm.value;
    this.physicLib.department = this.currentDepartment;
    this.physicLib.instruction = this.physicLibForm.controls.instructionForm.value;
    this.physicLib.sortOrder = this.physicLibForm.controls.sortOrderForm.value;
    this.physicLib.active = this.active;
    this.physicLib.fictitious = this.fictitious;
    this.physicLib.docStructId = this.docStruct.id;

    return this.physicLib;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(PhysicalLibraryDocStructSearchDialogComponent, {
      data: this.docStruct
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result != null) {
        this.docStruct = result;
        this.updateDocStructText(this.docStruct.useName);
      }
    });
  }

  isValid(): boolean {
    return this.physicLibForm.valid && this.docStruct != null;
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
