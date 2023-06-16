import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';

@Component({
  selector: 'app-data-selector-search-list',
  templateUrl: './data-selector-search-list.component.html',
  styleUrls: ['./data-selector-search-list.component.scss']
})
export class DataSelectorSearchListComponent implements OnInit {

  @Input() institutionList: BroadcastInstitution[];
  @Input() docStructList: BroadcastDocumentaryStructure[];
  @Input() physicLibList: BroadcastPhysicalLibrary[];

  @Input() nbResult: number;

  @Output() selectedAdministrationType = new EventEmitter<AdministrationTypesEnum>();
  @Output() validateSelection = new EventEmitter<AdministrationTypesEnum>();

  currentAdministrationType: AdministrationTypesEnum;

  tabs = [
    AdministrationTypesEnum.ESTABLISHMENT,
    AdministrationTypesEnum.DOC_STRUCT,
    AdministrationTypesEnum.PHYSIC_LIB
  ];

  ngOnInit() {
    this.onChangeSelectedIndex(0);
  }

  onChangeSelectedIndex(index: number) {
    this.currentAdministrationType = this.tabs[index];
    this.selectedAdministrationType.emit(this.currentAdministrationType);
  }

  onClickUseSelectionButton() {
    this.validateSelection.emit(this.currentAdministrationType);
  }

}
