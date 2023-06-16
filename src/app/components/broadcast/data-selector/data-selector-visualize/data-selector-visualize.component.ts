import { Component, OnDestroy, OnInit } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { ESGBUService } from 'src/app/services/esgbu.service';
import { DataTypeFlatNode } from '../data-selector-types-tree/data-selector-types-tree.component';

@Component({
  selector: 'app-data-selector-visualize',
  templateUrl: './data-selector-visualize.component.html',
  styleUrls: ['./data-selector-visualize.component.scss']
})
export class DataSelectorVisualizeComponent implements OnInit, OnDestroy {

  administrationTypeEnum = AdministrationTypesEnum;

  establishments: BroadcastInstitution[];
  docStructs: BroadcastDocumentaryStructure[];
  physicLibs: BroadcastPhysicalLibrary[];

  establishmentDataTypes: DataTypeFlatNode[] = [];
  docStructDataTypes: DataTypeFlatNode[] = [];
  physicLibDataTypes: DataTypeFlatNode[] = [];

  showEstablishmentTable = false;
  showDocStructTable = false;
  showPhysicLibTable = false;

  hasEstablishmentInfoToShow = false;
  hasDocStructInfoToShow = false;
  hasPhysicLibInfoToShow = false;

  constructor(
    private dataSelectorService: DataSelectorService,
    private esgbuService: ESGBUService
  ) { }

  ngOnInit() {
    this.esgbuService.setTitle('broadcast.visualizeDataTitle', true);

    this.establishmentDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.ESTABLISHMENT);
    this.docStructDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.DOC_STRUCT);
    this.physicLibDataTypes = this.dataSelectorService.getStoredSelectedType(AdministrationTypesEnum.PHYSIC_LIB);

    Promise.all([
      this.dataSelectorService
        .getStoredValidateSelection(AdministrationTypesEnum.ESTABLISHMENT).then((establishments) => {
          this.establishments = establishments as BroadcastInstitution[];
          this.hasEstablishmentInfoToShow = this.establishments?.length > 0 && this.establishmentDataTypes?.length > 0;
        }),

      this.dataSelectorService.
        getStoredValidateSelection(AdministrationTypesEnum.DOC_STRUCT).then((docStructs) => {
          this.docStructs = docStructs as BroadcastDocumentaryStructure[];
          this.hasDocStructInfoToShow = this.docStructs?.length > 0 && this.docStructDataTypes?.length > 0;
        }),

      this.dataSelectorService
        .getStoredValidateSelection(AdministrationTypesEnum.PHYSIC_LIB).then((physicLibs) => {
          this.physicLibs = physicLibs as BroadcastPhysicalLibrary[];
          this.hasPhysicLibInfoToShow = this.physicLibs?.length > 0 && this.physicLibDataTypes?.length > 0;
        })
    ]).then(() => this.initView());
  }

  ngOnDestroy() {
    this.esgbuService.clearTitle();
  }

  onChangeTab(administrationType: AdministrationTypesEnum) {
    this.showEstablishmentTable = administrationType === AdministrationTypesEnum.ESTABLISHMENT;
    this.showDocStructTable = administrationType === AdministrationTypesEnum.DOC_STRUCT;
    this.showPhysicLibTable = administrationType === AdministrationTypesEnum.PHYSIC_LIB;
  }

  private initView() {
    if (this.hasEstablishmentInfoToShow) {
      this.showEstablishmentTable = true;
    } else if (this.hasDocStructInfoToShow) {
      this.showDocStructTable = true;
    } else if (this.hasPhysicLibInfoToShow) {
      this.showPhysicLibTable = true;
    }
  }

}
