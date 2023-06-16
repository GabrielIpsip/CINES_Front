import { FormGroup } from '@angular/forms';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { CommonDataSelector } from './common-data-selector';

export class EstablishmentDataSelector extends CommonDataSelector {

  constructor(
    searchFields: FormGroup,
    dataSelectorService: DataSelectorService
  ) {
    super(searchFields, AdministrationTypesEnum.ESTABLISHMENT, dataSelectorService);
  }

  onChangePostalCodeForm(query: any, postalCode: string) {
    if (postalCode == null || postalCode.length === 0) {
      return;
    }

    const term = { prefix: { postalCode } };
    query.bool.must.push(term);
  }

  onChangeNameForm(query: any, name: string, exact: boolean) {
    if (name == null || name.length === 0) {
      return;
    }

    const match = { multi_match: { query: name, fields: ['officialName', 'useName', 'acronym', 'brand'] } };

    this.addParamIfExactOrNot(match.multi_match, exact);

    query.bool.must.push(match);
  }

  onChangeAddressForm(query: any, address: string) {
    if (address == null || address.length === 0) {
      return;
    }

    const match = { multi_match: { query: address, fields: ['address', 'city', 'department', 'region'] } };
    query.bool.must.push(match);
  }

  onChangeTypeForm(query: any, type: string[]) {
    if (type == null || type.length === 0) {
      return;
    }

    const term = { terms: { type } };
    query.bool.must.push(term);
  }

  onChangeDepartmentForm(query: any, department: string[]) {
    if (department == null || department.length === 0) {
      return;
    }

    const term = { terms: { department } };
    query.bool.must.push(term);
  }

  onChangeRegionForm(query: any, region: string[]) {
    if (region == null || region.length === 0) {
      return;
    }

    const term = { terms: { region } };
    query.bool.must.push(term);
  }

}
