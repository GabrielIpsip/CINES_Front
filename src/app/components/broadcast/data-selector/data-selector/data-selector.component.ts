import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { SearchResponse } from 'elasticsearch';
import { Observable, Subscription } from 'rxjs';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { ConfirmDialogComponent } from 'src/app/components/shared/confirm-dialog/confirm-dialog.component';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { BroadcastInstitutionsService } from 'src/app/services/broadcast/broadcast-institutions.service';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { DataTypesService } from 'src/app/services/data-types.service';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { CommonDataSelector } from '../common-data-selector';
import { DocStructDataSelector } from '../doc-struct-data-selector';
import { EstablishmentDataSelector } from '../establishment-data-selector';
import { PhysicLibDataSelector } from '../physic-lib-data-selector';
import { of } from 'rxjs';
import { LoaderService } from 'src/app/services/loader.service';
import { DepartmentsService } from 'src/app/services/departments.service';

@Component({
  selector: 'app-data-selector',
  templateUrl: './data-selector.component.html',
  styleUrls: ['./data-selector.component.scss']
})
export class DataSelectorComponent implements OnInit, OnDestroy {

  private readonly INNER_HIT_SIZE: number = 100;

  private simpleMode = true;

  searchFields: FormGroup = this.getInitialSearchFields();

  currentValues: any[];
  currentTab: AdministrationTypesEnum;

  institutionsResultList: BroadcastInstitution[];
  docStructResultList: BroadcastDocumentaryStructure[];
  physicLibResultList: BroadcastPhysicalLibrary[];

  institutionNbResult: number;
  docStructNbResult: number;
  physicLibNbResult: number;

  institutionIndexPaginatorSub: Subscription;
  institutionSizePaginatorSub: Subscription;
  docStructIndexPaginatorSub: Subscription;
  docStructSizePaginatorSub: Subscription;
  physicLibIndexPaginatorSub: Subscription;
  physicLibSizePaginatorSub: Subscription;

  dateList: string[] = [];
  typeList: string[] = [];
  departmentList: string[] = [];
  regionList: string[] = [];

  establishmentDataSelector = new EstablishmentDataSelector(
    this.searchFields, this.dataSelectorService);
  docStructDataSelector = new DocStructDataSelector(
    this.searchFields, this.institutionsService.DOC_STRUCT_PATH, this.dataSelectorService);
  physicLibDataSelector = new PhysicLibDataSelector(
    this.searchFields, this.institutionsService.PHYSIC_LIB_PATH, this.dataSelectorService);

  enableSearch = true; // To Disable search when a form value change.

  listenValidateSub: Subscription;

  searchSubscription: Subscription[] = [];
  disableCleanSubscription = false;

  lastQueryByTab = new Map<AdministrationTypesEnum, string>(); // Prevent to launch two same request

  constructor(
    private institutionsService: BroadcastInstitutionsService,
    private dataTypesService: DataTypesService,
    private router: Router,
    private dataSelectorService: DataSelectorService,
    private esgbuService: ESGBUService,
    private confirmDialog: MatDialog,
    private loaderService: LoaderService,
    private departmentsService: DepartmentsService
  ) { }

  ngOnInit() {

    this.esgbuService.setTitle('broadcast.dataSelectorAdmininstrationTitle', true);

    Promise.all([

      this.institutionsService.getMapping().toPromise().then(async (response) => {
        await this.dataTypesService.getAllDataTypesOrdered().toPromise().then((esgbuApiResponse) => {
          this.establishmentDataSelector.setDataTypes(
            this.institutionsService.getEstablishmentMapping(response), esgbuApiResponse);
          this.docStructDataSelector.setDataTypes(
            this.institutionsService.getDocStructMapping(response), esgbuApiResponse);
          this.physicLibDataSelector.setDataTypes(
            this.institutionsService.getPhysicLibMapping(response), esgbuApiResponse);
        });

      }),

      this.institutionsService.getAllYears().toPromise().then((response) => {
        this.dateList = this.institutionsService
          .getAggregationsKey(response, this.institutionsService.YEARS_AGGS_NAME)
          .sort()
          .reverse();
        this.setLastDate();
      }),

      this.institutionsService.getAllEstablishmentType().toPromise().then((response) => {
        this.typeList = this.institutionsService
          .getAggregationsKey(response, this.institutionsService.TYPES_AGGS_NAME);
      }),

      this.departmentsService.getAllDepartments(true).toPromise().then((response) => {
        const departments = [];
        const regions = [];
        for (const department of response) {
          if (!departments.includes(department.name)) {
            departments.push(department.name);
          }
          if (!regions.includes(department.region.name)) {
            regions.push(department.region.name);
          }
        }
        this.departmentList = departments.sort(
           (a, b) => {
            return a.localeCompare(b);
          }
        );
        this.regionList = regions.sort(
           (a, b) => {
            return a.localeCompare(b);
          }
        );
      })

    ]).then(() => { this.restoreSavedFormValues(); });


    this.searchFields.valueChanges.subscribe({
      next: (values) => {
        this.currentValues = values;
        if (this.enableSearch) {
          this.searchFieldsHasChanged(values, this.currentTab);
        }
      }
    });

    this.subscribeInstitutionPaginator();
    this.subscribeDocStructPaginator();
    this.subscribePhysicLibPaginator();

    this.showExplanation();
    this.listenValidateSelection();
  }


  ngOnDestroy() {
    this.esgbuService.clearTitle();

    this.listenValidateSub?.unsubscribe();

    this.institutionIndexPaginatorSub?.unsubscribe();
    this.institutionSizePaginatorSub?.unsubscribe();
    this.docStructIndexPaginatorSub?.unsubscribe();
    this.docStructSizePaginatorSub?.unsubscribe();
    this.physicLibIndexPaginatorSub?.unsubscribe();
    this.physicLibSizePaginatorSub?.unsubscribe();


    this.saveAllFormValues();
    this.cleanAllReseachSubscription();
  }

  get f(): { [key: string]: AbstractControl; } {
    return this.searchFields.controls;
  }

  get nbResult(): number {
    switch (this.currentTab) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        return this.institutionNbResult;
      case AdministrationTypesEnum.DOC_STRUCT:
        return this.docStructNbResult;
      case AdministrationTypesEnum.PHYSIC_LIB:
        return this.physicLibNbResult;
    }
  }

  private subscribeInstitutionPaginator() {
    this.institutionIndexPaginatorSub = this.dataSelectorService.institutionIndexPaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });

    this.institutionSizePaginatorSub = this.dataSelectorService.institutionSizePaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });
  }

  private subscribeDocStructPaginator() {
    this.docStructIndexPaginatorSub = this.dataSelectorService.docStructIndexPaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });

    this.docStructSizePaginatorSub = this.dataSelectorService.docStructSizePaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });
  }

  private subscribePhysicLibPaginator() {
    this.physicLibIndexPaginatorSub = this.dataSelectorService.physicLibIndexPaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });

    this.physicLibSizePaginatorSub = this.dataSelectorService.physicLibSizePaginatorSubject.asObservable()
      .subscribe({
        next: () => this.onChangePaginator()
      });
  }

  private onChangePaginator() {
    if (this.currentValues != null) {
      this.lastQueryByTab.set(this.currentTab, '');
      this.searchFieldsHasChanged(this.currentValues, this.currentTab);
    }
  }

  private saveAllFormValues() {
    const forms = Object.entries(this.f);
    const formValues: [string, any][] = [];
    for (const form of forms) {
      formValues.push([form[0], form[1].value]);
    }
    this.dataSelectorService.saveDataSelectorFormValues(formValues);

    this.establishmentDataSelector.saveAllDataTypeFormValues();
    this.docStructDataSelector.saveAllDataTypeFormValues();
    this.physicLibDataSelector.saveAllDataTypeFormValues();
  }

  get isSimpleMode(): boolean {
    return this.simpleMode;
  }

  setSimpleMode(value: boolean) {
    this.simpleMode = value;
    this.searchFields.updateValueAndValidity();
  }

  private restoreSavedFormValues() {
    this.enableSearch = false;
    const savedFormValues: [string, any][] = this.dataSelectorService.getSavedDataSelectorFormValues();
    const currentFormNames = Object.keys(this.f);
    for (const savedFormValue of savedFormValues) {
      const savedName = savedFormValue[0];
      const savedValue = savedFormValue[1];
      if (currentFormNames.includes(savedName)) {
        this.f[savedName].setValue(savedValue);
      }
    }
    this.enableSearch = true;
    this.establishmentDataSelector.restoreAllDataTypeFormValues();
    this.docStructDataSelector.restoreAllDataTypeFormValues();
    this.physicLibDataSelector.restoreAllDataTypeFormValues();
    this.searchFields.enable();
  }

  private setLastDate() {
    if (this.dateList.length > 0) {
      const lastEnableSearchStatus = this.enableSearch;
      this.enableSearch = false;
      this.searchFields.controls.dateForm.setValue([this.dateList[0]]);
      this.enableSearch = lastEnableSearchStatus;
    }
  }

  private getInitialSearchFields(): FormGroup {
    return new FormGroup({
      dateForm: new FormControl(),

      establishmentNameForm: new FormControl(),
      establishmentExactNameCheckBox: new FormControl(false),
      establishmentPostalCodeForm: new FormControl('', [Validators.maxLength(5), Validators.pattern('^[0-9]*$')]),
      establishmentDepartmentForm: new FormControl(),
      establishmentRegionForm: new FormControl(),
      establishmentAddressForm: new FormControl(),
      establishmentTypeForm: new FormControl(),

      docStructNameForm: new FormControl(),
      docStructExactNameCheckBox: new FormControl(false),
      docStructPostalCodeForm: new FormControl('', [Validators.maxLength(5), Validators.pattern('^[0-9]*$')]),
      docStructDepartmentForm: new FormControl(),
      docStructRegionForm: new FormControl(),
      docStructAddressForm: new FormControl(),

      physicLibNameForm: new FormControl(),
      physicLibExactNameCheckBox: new FormControl(false),
      physicLibPostalCodeForm: new FormControl('', [Validators.maxLength(5), Validators.pattern('^[0-9]*$')]),
      physicLibAddressForm: new FormControl(),
      physicLibDepartmentForm: new FormControl(),
      physicLibRegionForm: new FormControl(),
      physicLibFictitiousCheckBox: new FormControl(true),
      physicLibPhysicalCheckBox: new FormControl(true),
    });
  }

  private searchFieldsHasChanged(values: any, administrationTypeTab: AdministrationTypesEnum, useSize = true)
    : Observable<any> {

    const query = {
      bool: {
        must: []
      }
    };

    this.onChangeDateForm(query, values.dateForm);
    this.setEstablishmentFacetsInQuery(query, values);

    const hasDocStructNestedQueryPhysicLib = this.physicLibDataSelector.hasNestedFieldPhysicLib(values, this.simpleMode)
      && administrationTypeTab === AdministrationTypesEnum.DOC_STRUCT;

    const hasPhysicLibNestedQueryDocStruct = this.docStructDataSelector.hasNestedFieldDocStruct(values, this.simpleMode)
      && administrationTypeTab === AdministrationTypesEnum.PHYSIC_LIB;

    if ((this.docStructDataSelector.hasNestedFieldDocStruct(values, this.simpleMode)
      || administrationTypeTab === AdministrationTypesEnum.DOC_STRUCT) && !hasPhysicLibNestedQueryDocStruct) {

      const nestedQuery = this.setDocStructFacetsInQuery(query, values);

      if (hasDocStructNestedQueryPhysicLib) {
        this.setPhysicLibFacetsInQuery(nestedQuery.nested.query, values);
      }
    }

    if ((this.physicLibDataSelector.hasNestedFieldPhysicLib(values, this.simpleMode)
      || administrationTypeTab === AdministrationTypesEnum.PHYSIC_LIB) && !hasDocStructNestedQueryPhysicLib) {

      const nestedQuery = this.setDocStructFacetsInQuery(query, values);
      this.setPhysicLibFacetsInQuery(nestedQuery.nested.query, values);
    }

    return this.getResult(query, administrationTypeTab, useSize);

  }

  private setEstablishmentFacetsInQuery(query: any, values: any) {
    this.establishmentDataSelector
      .onChangeNameForm(query, values.establishmentNameForm, values.establishmentExactNameCheckBox);
    this.establishmentDataSelector.onChangePostalCodeForm(query, values.establishmentPostalCodeForm);
    this.establishmentDataSelector.onChangeAddressForm(query, values.establishmentAddressForm);
    this.establishmentDataSelector.onChangeDepartmentForm(query, values.establishmentDepartmentForm);
    this.establishmentDataSelector.onChangeRegionForm(query, values.establishmentRegionForm);
    this.establishmentDataSelector.onChangeTypeForm(query, values.establishmentTypeForm);
    if (!this.simpleMode) {
      this.establishmentDataSelector.onChangeDataTypeValue(query, values);
    } else {
      this.establishmentDataSelector.onChangeSimpleDataTypeValue(query, values);
    }
  }

  private setDocStructFacetsInQuery(query: any, values: any): any {
    const nestedBody = { nested: { path: this.institutionsService.DOC_STRUCT_PATH, query: { bool: { must: [] } } } };
    query.bool.must.push(nestedBody);

    this.docStructDataSelector
      .onChangeNameForm(nestedBody.nested.query, values.docStructNameForm, values.docStructExactNameCheckBox);
    this.docStructDataSelector.onChangePostalCodeForm(nestedBody.nested.query, values.docStructPostalCodeForm);
    this.docStructDataSelector.onChangeAddressForm(nestedBody.nested.query, values.docStructAddressForm);
    this.docStructDataSelector.onChangeDepartmentForm(nestedBody.nested.query, values.docStructDepartmentForm);
    this.docStructDataSelector.onChangeRegionForm(nestedBody.nested.query, values.docStructRegionForm);

    if (!this.simpleMode) {
      this.docStructDataSelector.onChangeDataTypeValue(nestedBody.nested.query, values);
    } else {
      this.docStructDataSelector.onChangeSimpleDataTypeValue(nestedBody.nested.query, values);
    }

    return nestedBody;
  }

  private setPhysicLibFacetsInQuery(query: any, values: any): any {
    const nestedBody = { nested: { path: this.institutionsService.PHYSIC_LIB_PATH, query: { bool: { must: [] } } } };
    query.bool.must.push(nestedBody);

    this.physicLibDataSelector
      .onChangeNameForm(nestedBody.nested.query, values.physicLibNameForm, values.physicLibExactNameCheckBox);
    this.physicLibDataSelector.onChangePostalCodeForm(nestedBody.nested.query, values.physicLibPostalCodeForm);
    this.physicLibDataSelector.onChangeAddressForm(nestedBody.nested.query, values.physicLibAddressForm);
    this.physicLibDataSelector.onChangeDepartmentForm(nestedBody.nested.query, values.physicLibDepartmentForm);
    this.physicLibDataSelector.onChangeRegionForm(nestedBody.nested.query, values.physicLibRegionForm);
    this.physicLibDataSelector.onChangeFictitiousCheckBox
      (nestedBody.nested.query, values.physicLibFictitiousCheckBox, values.physicLibPhysicalCheckBox);

    if (!this.simpleMode) {
      this.physicLibDataSelector.onChangeDataTypeValue(nestedBody.nested.query, values);
    } else {
      this.physicLibDataSelector.onChangeSimpleDataTypeValue(nestedBody.nested.query, values);
    }

    return nestedBody;
  }

  private getResult(query: any, currentTab: AdministrationTypesEnum, useSize: boolean): Observable<SearchResponse<any>> {
    if (JSON.stringify(query) === this.lastQueryByTab.get(currentTab) && useSize) {
      return of();
    }
    this.lastQueryByTab.set(currentTab, JSON.stringify(query));
    this.cleanAllReseachSubscription();

    switch (currentTab) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        return this.getResultForEstablishmentTab(query, useSize);
      case AdministrationTypesEnum.DOC_STRUCT:
        return this.getResultForDocStructTab(query, useSize);
      case AdministrationTypesEnum.PHYSIC_LIB:
        return this.getResultForPhysicLibTab(query, useSize);
    }
  }

  private getResultForEstablishmentTab(query: any, useSize: boolean): Observable<SearchResponse<BroadcastInstitution>> {
    let size = this.institutionsService.MAX_SIZE;
    let from = 0;
    if (useSize) {
      size = this.dataSelectorService.institutionSizePaginatorSubject.value;
      from = size * this.dataSelectorService.institutionIndexPaginatorSubject.value;
    }

    const obs = this.institutionsService.getAllInstitution(query, size, from);
    const subscription = obs.subscribe({
      next: (response) => {
        if (useSize) {
          this.institutionsResultList = this.institutionsService.getDocumentsContent(response);
          this.dataSelectorService.institutionCountPaginator =
            this.institutionsService.getCountDocumentOfResponse(response);
          this.institutionNbResult = this.institutionsService.getNumberUniqueInstitution(response);
        }
      }
    });
    this.addResearchSubscription(subscription);
    return obs;
  }

  private getResultForDocStructTab(query: any, useSize: boolean): Observable<SearchResponse<any>> {
    for (const mustParam of query.bool.must) {
      for (const [key, value] of Object.entries<any>(mustParam)) {
        if (key === 'nested' && value.path === this.institutionsService.DOC_STRUCT_PATH) {
          value.inner_hits = { size: this.INNER_HIT_SIZE };
          break;
        }
      }
    }

    let size = this.institutionsService.MAX_SIZE;
    let from = 0;
    if (useSize) {
      size = this.dataSelectorService.docStructSizePaginatorSubject.value;
      from = size * this.dataSelectorService.docStructIndexPaginatorSubject.value;
    }

    const obs = this.institutionsService
      .getAllNestedAdministration(query, this.institutionsService.DOC_STRUCT_PATH, size, from);
    const subscription = obs.subscribe({
      next: (response) => {
        if (useSize) {
          this.docStructResultList = this.institutionsService.getDocumentDocumentsContentInnerHits(
            response, this.institutionsService.BASE_NAME, this.institutionsService.DOC_STRUCT_PATH, ['year']);
          this.dataSelectorService.docStructCountPaginator = this.institutionsService
            .getCountInnerDocumentOfResponse(response, this.institutionsService.DOC_STRUCT_PATH);
          this.docStructNbResult = this.institutionsService.getNumberUniqueDocStruct(response);
        }
      }
    });
    this.addResearchSubscription(subscription);
    return obs;
  }

  private getResultForPhysicLibTab(query: any, useSize: boolean): Observable<SearchResponse<any>> {
    for (const mustParamDocStruct of query.bool.must) {
      for (const [keyDocStruct, valueDocStruct] of Object.entries<any>(mustParamDocStruct)) {
        if (keyDocStruct === 'nested' && valueDocStruct.path === this.institutionsService.DOC_STRUCT_PATH) {
          valueDocStruct.inner_hits = {
            size: this.INNER_HIT_SIZE, _source: [
              this.institutionsService.DOC_STRUCT_PATH + '.id',
              this.institutionsService.DOC_STRUCT_PATH + '.useName'
            ]
          };

          for (const mustParam of valueDocStruct.query.bool.must) {
            for (const [keyPhysicLib, valuePhysicLib] of Object.entries<any>(mustParam)) {
              if (keyPhysicLib === 'nested' && valuePhysicLib.path === this.institutionsService.PHYSIC_LIB_PATH) {
                valuePhysicLib.inner_hits = { size: this.INNER_HIT_SIZE };
              }
            }
          }
        }
      }
    }

    let size = this.institutionsService.MAX_SIZE;
    let from = 0;
    if (useSize) {
      size = this.dataSelectorService.physicLibSizePaginatorSubject.value;
      from = size * this.dataSelectorService.physicLibIndexPaginatorSubject.value;
    }
    const obs = this.institutionsService.getAllNestedAdministration(
      query, this.institutionsService.PHYSIC_LIB_PATH, size, from);
    const subscription = obs.subscribe({
      next: (response) => {
        if (useSize) {
          this.physicLibResultList = this.institutionsService.getDocumentDocumentsContentInnerInnerHits(
            response, this.institutionsService.BASE_NAME, this.institutionsService.DOC_STRUCT_PATH,
            this.institutionsService.PHYSIC_LIB_PATH, ['year']);
          this.dataSelectorService.physicLibCountPaginator = this.institutionsService
            .getCountInnerInnerDocumentOfResponse(response, this.institutionsService.PHYSIC_LIB_PATH);
          this.physicLibNbResult = this.institutionsService.getNumberUniquePhysicLib(response);
        }
      }
    });

    this.addResearchSubscription(subscription);
    return obs;
  }

  onTabChange(administrationType: AdministrationTypesEnum) {
    this.currentTab = administrationType;
    if (this.currentValues != null) {
      this.searchFieldsHasChanged(this.currentValues, administrationType);
    }
  }

  onValidateSelection() {
    this.loaderService.show(true);
    this.disableCleanSubscription = true;
    this.storeDataTypeForDataTypeSelection();

    Promise.all([
      this.searchFieldsHasChanged(this.searchFields.value, AdministrationTypesEnum.ESTABLISHMENT, false).toPromise(),
      this.searchFieldsHasChanged(this.searchFields.value, AdministrationTypesEnum.DOC_STRUCT, false).toPromise(),
      this.searchFieldsHasChanged(this.searchFields.value, AdministrationTypesEnum.PHYSIC_LIB, false).toPromise()
    ]).then(([institutionResultList, docStructResultList, physicLibResultList]) => {
      institutionResultList = this.institutionsService.getDocumentsContent(institutionResultList);
      docStructResultList = this.institutionsService.getDocumentDocumentsContentInnerHits(
        docStructResultList, this.institutionsService.BASE_NAME, this.institutionsService.DOC_STRUCT_PATH, ['year']);
      physicLibResultList = this.institutionsService.getDocumentDocumentsContentInnerInnerHits(
        physicLibResultList, this.institutionsService.BASE_NAME, this.institutionsService.DOC_STRUCT_PATH,
        this.institutionsService.PHYSIC_LIB_PATH, ['year']);

      this.dataSelectorService
        .setStoredValidateEstablishmentSelection(institutionResultList);
      this.dataSelectorService
        .setStoredValidateDocStructSelection(docStructResultList, false);
      this.dataSelectorService
        .setStoredValidatePhysicLibSelection(physicLibResultList, false);
      this.disableCleanSubscription = false;
      this.loaderService.hide(true);
      this.navigateToDataSelectorTypes();

    }
    );
  }

  private navigateToDataSelectorTypes() {
    this.router.navigateByUrl('/broadcast/data-selector-types');
  }

  private listenValidateSelection() {
    this.listenValidateSub = this.dataSelectorService.validateSelectedAdministrationObs.subscribe({
      next: (value) => {
        if (value) {
          this.storeDataTypeForDataTypeSelection();

          const establishments = this.dataSelectorService
            .getSelectedAdministration(AdministrationTypesEnum.ESTABLISHMENT) as BroadcastInstitution[];
          const docStruct = this.dataSelectorService
            .getSelectedAdministration(AdministrationTypesEnum.DOC_STRUCT) as BroadcastDocumentaryStructure[];
          const physicLib = this.dataSelectorService
            .getSelectedAdministration(AdministrationTypesEnum.PHYSIC_LIB) as BroadcastPhysicalLibrary[];

          Promise.all([
            this.dataSelectorService.setStoredValidateEstablishmentSelection(establishments),
            this.dataSelectorService.setStoredValidateDocStructSelection(docStruct, false),
            this.dataSelectorService.setStoredValidatePhysicLibSelection(physicLib, false),
          ]).then(
            () => {
              this.dataSelectorService.notifyOnValidateSelection(true);
              this.router.navigateByUrl('/broadcast/data-selector-types');
            },
            () => {
              this.dataSelectorService.notifyOnValidateSelection(true);
              this.router.navigateByUrl('/broadcast/data-selector-types');
            });
        }
      }
    });
  }

  private storeDataTypeForDataTypeSelection() {
    this.dataSelectorService
      .setStoredDataSelectorDataTypes(AdministrationTypesEnum.ESTABLISHMENT, this.establishmentDataSelector);
    this.dataSelectorService
      .setStoredDataSelectorDataTypes(AdministrationTypesEnum.DOC_STRUCT, this.docStructDataSelector);
    this.dataSelectorService
      .setStoredDataSelectorDataTypes(AdministrationTypesEnum.PHYSIC_LIB, this.physicLibDataSelector);
  }

  private onChangeDateForm(query: any, dates: string[]) {
    if (dates == null || dates.length === 0) {
      return;
    }

    const term = { terms: { year: dates } };
    query.bool.must.push(term);

  }

  cleanAllForm() {
    this.enableSearch = false;
    const initialSearchField = this.getInitialSearchFields();
    const initFieldsName = Object.keys(initialSearchField.controls);
    for (const field of initFieldsName) {
      this.searchFields.controls[field].setValue(initialSearchField.controls[field].value);
    }
    for (const formName of Object.keys(this.searchFields.controls)) {
      if (formName.indexOf(CommonDataSelector.SIMPLE_KEY) > -1) {
        this.searchFields.controls[formName].setValue(null);
      }
    }
    this.establishmentDataSelector.cleanDataTypeForm();
    this.docStructDataSelector.cleanDataTypeForm();
    this.physicLibDataSelector.cleanDataTypeForm();
    this.setLastDate();
    this.enableSearch = true;
    this.searchFields.enable();
  }

  showExplanation() {
    const key = 'data-selector';
    const noShowMore = JSON.parse(localStorage.getItem(key));
    if (noShowMore) {
      return;
    }

    this.confirmDialog.open(ConfirmDialogComponent,
      {
        data: {
          title: 'broadcast.explanationTitle',
          message: 'broadcast.explanationContent',
          hideNoButton: true,
          yesButtonText: 'info.understand',
          noShowMoreCheckBoxID: key
        }
      });
  }

  private addResearchSubscription(subscription: Subscription) {
    this.cleanAllReseachSubscription();
    this.searchSubscription.push(subscription);
  }

  private cleanAllReseachSubscription() {
    if (this.disableCleanSubscription) {
      return;
    }

    for (const subscription of this.searchSubscription) {
      if (subscription.closed) {
        this.searchSubscription.shift();
      } else {
        subscription.unsubscribe();
      }
    }
  }

}

