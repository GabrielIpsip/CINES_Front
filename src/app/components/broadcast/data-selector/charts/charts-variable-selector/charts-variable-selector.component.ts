import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { TypesEnum } from 'src/app/common/typesEnum.enum';
import { BroadcastAdministration } from 'src/app/models/broadcast/broadcast-administration.model';
import { BroadcastDataType } from 'src/app/models/broadcast/broadcast-data-type.model';
import { BroadcastDocumentaryStructure } from 'src/app/models/broadcast/broadcast-documentary-structure.model';
import { BroadcastInstitution } from 'src/app/models/broadcast/broadcast-institution.model';
import { BroadcastPhysicalLibrary } from 'src/app/models/broadcast/broadcast-physical-library.model';
import { DataTypeFlatNode } from '../../data-selector-types-tree/data-selector-types-tree.component';

@Component({
  selector: 'app-charts-variable-selector',
  templateUrl: './charts-variable-selector.component.html',
  styleUrls: ['./charts-variable-selector.component.scss']
})
export class ChartsVariableSelectorComponent implements OnChanges {

  @Input() multiple: boolean;
  @Input() selectedAdministration: BroadcastAdministration[];
  @Input() dataTypes: Map<string, DataTypeFlatNode>;

  @Output() selectedVariable = new EventEmitter<BroadcastDataType[]>();

  variables: string[] = [];

  ngOnChanges() {
    this.variables = [];
    if (this.selectedAdministration?.length > 0) {
      this.updateVariables();
    }
  }

  private updateVariables() {
    const establishmentExample = new BroadcastInstitution();
    const docStructExample = new BroadcastDocumentaryStructure();
    const physicLibExample = new BroadcastPhysicalLibrary();

    for (const administration of this.selectedAdministration) {
      for (const code of Object.keys(administration)) {
        const isVariable = !(establishmentExample.hasOwnProperty(code)
          || docStructExample.hasOwnProperty(code)
          || physicLibExample.hasOwnProperty(code));


        if (isVariable && !this.variables.includes(code)) {
          const variableType = this.dataTypes.get(code)?.type;
          const isNumber = variableType === TypesEnum.number || variableType === TypesEnum.operation;
          if (isNumber) {
            this.variables.push(code);
          }
        }
      }
    }
  }

  onChangeValue(formInfo: any) {
    let value = formInfo.value;
    if (!Array.isArray(formInfo.value)) {
      value = [value];
    }
    this.selectedVariable.emit(value);
  }

}
