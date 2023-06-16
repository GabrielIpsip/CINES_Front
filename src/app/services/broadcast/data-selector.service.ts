import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject } from 'rxjs';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { CommonDataSelector } from 'src/app/components/broadcast/data-selector/common-data-selector';
import { DataTypeFlatNode } from 'src/app/components/broadcast/data-selector/data-selector-types-tree/data-selector-types-tree.component';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { DataTypes } from 'src/app/models/data-types.model';
import * as Dexie from 'dexie';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataSelectorService {

  private numberPercentilesMap = new Map<string, number[]>();

  private readonly dataTypeSuffix = 'DataTypes';
  private readonly selectedSuffix = 'Selected';
  private readonly dataTypeFormValuesSuffix = 'DataTypesFormValues';
  private readonly dataSelectorFormValuesKey = 'BroadcastDataSelectorFormValues';

  private validateSelectedAdministrationSubject = new BehaviorSubject<boolean>(false);
  validateSelectedAdministrationObs = this.validateSelectedAdministrationSubject.asObservable();

  private onChangeSelectedAdministrationSubject = new BehaviorSubject<boolean>(false);
  onChangeSelectedAdministrationObs = this.onChangeSelectedAdministrationSubject.asObservable();

  private validateEstablishment = [];
  private validateDocStruct = [];
  private validatePhysicLib = [];

  institutionCountPaginator = 0;
  institutionSizePaginatorSubject = new BehaviorSubject<number>(10);
  institutionIndexPaginatorSubject = new BehaviorSubject<number>(0);

  docStructCountPaginator = 0;
  docStructSizePaginatorSubject = new BehaviorSubject<number>(10);
  docStructIndexPaginatorSubject = new BehaviorSubject<number>(0);

  physicLibCountPaginator = 0;
  physicLibSizePaginatorSubject = new BehaviorSubject<number>(10);
  physicLibIndexPaginatorSubject = new BehaviorSubject<number>(0);

  constructor(
    private snackBar: MatSnackBar,
    private translate: TranslateService
  ) { }

  get numberPercentiles() {
    return this.numberPercentilesMap;
  }

  private setItemInLocalStorage(key: string, items: any): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(items));
      return true;
    } catch (error) {
      this.translate.stream('error.selectionTooBig').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
      return false;
    }
  }

  private setItemInIndexedDB(key: string, items: any): Promise<any> {
    try {
      const db = new Dexie.Dexie(key);
      db.version(1).stores({ [key]: '++' });
      return db[key].bulkPut(items);
    } catch (error) {
      this.translate.stream('error.selectionTooBig').subscribe({
        next: (value) => this.snackBar.open(value, null, { duration: 5000 })
      });
    }
    return of().toPromise();
  }

  private clearIndexedDB(key: string): Promise<any> {
    const db = new Dexie.Dexie(key);
    db.version(1).stores({ [key]: '++' });
    return db[key].clear();
  }

  getStoredValidateSelection(administrationType: AdministrationTypesEnum): Promise<BroadcastAdministration[]> {
    let validateAdministration = [];
    switch (administrationType) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        validateAdministration = this.validateEstablishment;
        break;
      case AdministrationTypesEnum.DOC_STRUCT:
        validateAdministration = this.validateDocStruct;
        break;
      case AdministrationTypesEnum.PHYSIC_LIB:
        validateAdministration = this.validatePhysicLib;
        break;
    }

    if (validateAdministration.length === 0) {
      const key = this.getValidateAdministrationLocalStorageKey(administrationType);
      const db = new Dexie.Dexie(key);
      db.version(1).stores({ [key]: '++' });
      return db[key].toArray();
    } else {
      return of(validateAdministration).toPromise();
    }
  }

  setStoredValidateEstablishmentSelection(establishments?: BroadcastInstitution[]): Promise<any> {
    const key = this.getValidateAdministrationLocalStorageKey(AdministrationTypesEnum.ESTABLISHMENT);
    this.clearIndexedDB(key);

    if (establishments == null) {
      establishments = [];
    }

    this.validateEstablishment = establishments;
    return this.setItemInIndexedDB(key, establishments);

  }

  setStoredValidateDocStructSelection(docStructs: BroadcastDocumentaryStructure[],
                                      addFromStoredEstablishment: boolean): Promise<any> {
    const key = this.getValidateAdministrationLocalStorageKey(AdministrationTypesEnum.DOC_STRUCT);
    this.clearIndexedDB(key);

    if (docStructs == null) {
      docStructs = [];
    }

    if (addFromStoredEstablishment) {
      this.getStoredValidateSelection(AdministrationTypesEnum.ESTABLISHMENT).then((establishments) => {
        this.addDocStructFromEstablishment(establishments as BroadcastInstitution[], docStructs);
      });
    }

    this.validateDocStruct = docStructs;
    return this.setItemInIndexedDB(key, docStructs);

  }

  setStoredValidatePhysicLibSelection(physicLibs: BroadcastPhysicalLibrary[],
                                      addFromStoredDocStruct: boolean): Promise<any> {
    const key = this.getValidateAdministrationLocalStorageKey(AdministrationTypesEnum.PHYSIC_LIB);
    this.clearIndexedDB(key);

    if (physicLibs == null) {
      physicLibs = [];
    }

    if (addFromStoredDocStruct) {
      this.getStoredValidateSelection(AdministrationTypesEnum.DOC_STRUCT).then((docStructs) => {
        this.addPhysicLibFromDocStruct(docStructs as BroadcastDocumentaryStructure[], physicLibs);
      });
    }


    this.validatePhysicLib = physicLibs;
    return this.setItemInIndexedDB(key, physicLibs);

  }

  setStoredDataSelectorDataTypes(administrationType: AdministrationTypesEnum, dataSelector: CommonDataSelector)
    : boolean {
    if (dataSelector != null) {
      const key = this.getDataTypeLocalStorageKeyPrefix(administrationType);
      const dataTypes = {
        [TypesEnum.boolean]: Array.from(dataSelector.dataTypeBool),
        [TypesEnum.text]: Array.from(dataSelector.dataTypeText),
        [TypesEnum.number]: Array.from(dataSelector.dataTypeNumber)
      };
      return this.setItemInLocalStorage(key, dataTypes);
    }
  }

  getStoredDataSelectorDataTypes(administrationType: AdministrationTypesEnum)
    : {
      [TypesEnum.boolean]: [string, DataTypes][],
      [TypesEnum.text]: [string, DataTypes][],
      [TypesEnum.number]: [string, DataTypes][]
    } {
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType);
    return JSON.parse(localStorage.getItem(key));
  }

  setStoredSelectedType(administrationType: AdministrationTypesEnum, selectedList: DataTypeFlatNode[]): boolean {
    if (selectedList == null) {
      selectedList = [];
    }
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.dataTypeSuffix;
    return this.setItemInLocalStorage(key, selectedList);
  }

  getStoredSelectedType(administrationType: AdministrationTypesEnum): DataTypeFlatNode[] {
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.dataTypeSuffix;
    const types = JSON.parse(localStorage.getItem(key));
    if (types == null) {
      return [];
    } else {
      return types;
    }
  }

  private getDataTypeLocalStorageKeyPrefix(administrationType: AdministrationTypesEnum): string {
    switch (administrationType) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        return 'storedEstablishmentDataSelector';
      case AdministrationTypesEnum.DOC_STRUCT:
        return 'storedDocStructDataSelector';
      case AdministrationTypesEnum.PHYSIC_LIB:
        return 'storedPhysicLibDataSelector';
    }
  }

  private getValidateAdministrationLocalStorageKey(administrationType: AdministrationTypesEnum): string {
    switch (administrationType) {
      case AdministrationTypesEnum.ESTABLISHMENT:
        return 'storedValidateEstablishments';
      case AdministrationTypesEnum.DOC_STRUCT:
        return 'storedValidateDocStructs';
      case AdministrationTypesEnum.PHYSIC_LIB:
        return 'storedValidatePhysicLibs';
    }
  }

  private addDocStructFromEstablishment(establishments: BroadcastInstitution[],
                                        docStructs: BroadcastDocumentaryStructure[]) {

    if (establishments == null) {
      return;
    }

    for (const establishment of establishments) {
      if (!establishment.hasOwnProperty('documentaryStructures') || establishment.documentaryStructures?.length === 0) {
        continue;
      }

      for (const docStruct of establishment.documentaryStructures) {

        docStruct.year = establishment.year;

        let alreadyExists = false;
        for (const d of docStructs) {
          if (d.id === docStruct.id && d.year === docStruct.year) {
            alreadyExists = true;
          }
        }

        if (!alreadyExists) {
          docStructs.push(docStruct);
        }

      }
    }
  }

  private addPhysicLibFromDocStruct(docStructs: BroadcastDocumentaryStructure[],
                                    physicLibs: BroadcastPhysicalLibrary[]) {

    if (docStructs == null) {
      return;
    }

    for (const docStruct of docStructs) {
      if (!docStruct.hasOwnProperty('physicalLibraries') || docStruct?.physicalLibraries?.length === 0) {
        continue;
      }

      for (const physicLib of docStruct.physicalLibraries) {

        physicLib.year = docStruct.year;

        let alreadyExists = false;
        for (const p of physicLibs) {
          if (p.id === physicLib.id && p.year === physicLib.year) {
            alreadyExists = true;
          }
        }

        if (!alreadyExists) {
          physicLibs.push(physicLib);
        }
      }
    }
  }

  clearSelectedAdministration(administrationType: AdministrationTypesEnum) {
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.selectedSuffix;
    localStorage.removeItem(key);
    this.onChangeSelectedAdministrationSubject.next(true);
  }

  addSelectedAdministration(administrationType: AdministrationTypesEnum, administration: BroadcastAdministration,
                            notify = true): boolean {

    if (administration == null) {
      return false;
    }

    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.selectedSuffix;
    const storedSelectedAdministration = this.getSelectedAdministration(administrationType);

    for (const admin of storedSelectedAdministration) {
      if (admin.year === administration.year && admin.id === administration.id) {
        return false;
      }
    }

    storedSelectedAdministration.push(administration);
    if (!this.setItemInLocalStorage(key, storedSelectedAdministration)) {
      return false;
    }

    if (administrationType === AdministrationTypesEnum.ESTABLISHMENT) {
      this.addSubSelectedDocStruct(administration as BroadcastInstitution);
    } else if (administrationType === AdministrationTypesEnum.DOC_STRUCT) {
      this.addSubSelectedPhysicLib(administration as BroadcastDocumentaryStructure);
    }

    if (notify) {
      this.onChangeSelectedAdministrationSubject.next(true);
    }

    return true;
  }

  private addSubSelectedDocStruct(establishment: BroadcastInstitution) {
    const docStructs: BroadcastDocumentaryStructure[] = [];
    this.addDocStructFromEstablishment([establishment], docStructs);
    for (const docStruct of docStructs) {
      docStruct.institutionsId = establishment.id;
      docStruct.institutionsUseName = establishment.useName;
      this.addSelectedAdministration(AdministrationTypesEnum.DOC_STRUCT, docStruct, false);
    }
  }

  private addSubSelectedPhysicLib(docStruct: BroadcastDocumentaryStructure) {
    const physicLibs: BroadcastPhysicalLibrary[] = [];
    this.addPhysicLibFromDocStruct([docStruct], physicLibs);
    for (const physicLib of physicLibs) {
      physicLib.institutionsId = docStruct.institutionsId;
      physicLib.institutionsUseName = docStruct.institutionsUseName;
      physicLib.documentaryStructuresId = docStruct.id;
      physicLib.documentaryStructuresUseName = docStruct.useName;
      this.addSelectedAdministration(AdministrationTypesEnum.PHYSIC_LIB, physicLib, false);
    }
  }

  replaceSelectedAdministration(administrationType: AdministrationTypesEnum,
                                administrations: BroadcastAdministration[]) {
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.selectedSuffix;
    if (administrations?.length === 0) {
      localStorage.removeItem(key);
    }
    this.setItemInLocalStorage(key, administrations);
    this.onChangeSelectedAdministrationSubject.next(true);
  }

  getSelectedAdministration(administrationType: AdministrationTypesEnum): BroadcastAdministration[] {
    const key = this.getDataTypeLocalStorageKeyPrefix(administrationType) + this.selectedSuffix;
    let storedSelectedAdministration = JSON.parse(localStorage.getItem(key)) as BroadcastAdministration[];
    if (storedSelectedAdministration == null) {
      storedSelectedAdministration = [];
    }
    return storedSelectedAdministration;
  }

  notifyOnValidateSelection(reset = false) {
    this.validateSelectedAdministrationSubject.next(!reset);
  }

  saveDataSelectorFormValues(formValues: [string, any][]) {
    this.setItemInLocalStorage(this.dataSelectorFormValuesKey, formValues);
  }

  getSavedDataSelectorFormValues(): [string, any][] {
    let formValues = JSON.parse(localStorage.getItem(this.dataSelectorFormValuesKey));
    if (formValues == null) {
      formValues = [];
    }
    return formValues;
  }

  saveDataSelectorDataTypeFormValues(administrationType: AdministrationTypesEnum, formValues: [string, any][]) {
    const key = administrationType + this.dataTypeFormValuesSuffix;
    this.setItemInLocalStorage(key, formValues);
  }

  getSavedDataSelectorDataTypeFormValues(administrationType: AdministrationTypesEnum): [string, any][] {
    const key = administrationType + this.dataTypeFormValuesSuffix;
    let formValues = JSON.parse(localStorage.getItem(key));
    if (formValues == null) {
      formValues = [];
    }
    return formValues;
  }

  getSavedDataSelectorDataTypeFormValue(formName: string): any {
    const formValues = this.getSavedDataSelectorFormValues();
    for (const formValue of formValues) {
      if (formValue[0] === formName) {
        return formValue[1];
      }
    }
    return null;
  }

}
