import { FormGroup } from '@angular/forms';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { CommonDataSelector } from './common-data-selector';

export class DocStructDataSelector extends CommonDataSelector {

  constructor(
    searchFields: FormGroup,
    private docStructPath: string,
    dataSelectorService: DataSelectorService
  ) {
    super(searchFields, AdministrationTypesEnum.DOC_STRUCT, dataSelectorService, docStructPath);
  }

  onChangeNameForm(query: any, name: string, exact: boolean) {
    if (name == null || name.length === 0) {
      return;
    }

    const match = {
      multi_match: {
        query: name,
        fields: [`${this.docStructPath}.officialName`, `${this.docStructPath}.useName`, `${this.docStructPath}.acronym`]
      }
    };

    this.addParamIfExactOrNot(match.multi_match, exact);

    query.bool.must.push(match);
  }

  onChangeAddressForm(query: any, address: string) {
    if (address == null || address.length === 0) {
      return;
    }

    const match = {
      multi_match: {
        query: address,
        fields: [`${this.docStructPath}.address`, `${this.docStructPath}.city`, `${this.docStructPath}.department`,
        `${this.docStructPath}.region`]
      }
    };

    query.bool.must.push(match);
  }

  onChangePostalCodeForm(query: any, postalCode: string) {
    if (postalCode == null || postalCode.length === 0) {
      return;
    }

    const postalCodeIndex = this.docStructPath + '.postalCode';

    const term = { prefix: { [postalCodeIndex]: postalCode } };
    query.bool.must.push(term);

  }

  onChangeDepartmentForm(query: any, department: string[]) {
    if (department == null || department.length === 0) {
      return;
    }

    const departmentIndex = this.docStructPath + '.department';

    const term = { terms: { [departmentIndex]: department } };
    query.bool.must.push(term);
  }

  onChangeRegionForm(query: any, region: string[]) {
    if (region == null || region.length === 0) {
      return;
    }

    const regionIndex = this.docStructPath + '.region';

    const term = { terms: { [regionIndex]: region } };
    query.bool.must.push(term);
  }

  hasNestedFieldDocStruct(values: any, simpleMode: boolean): boolean {
    let hasField = values.docStructNameForm?.length > 0
      || values.docStructPostalCodeForm?.length > 0
      || values.docStructAddressForm?.length > 0
      || values.docStructDepartmentForm?.length > 0
      || values.docStructRegionForm?.length > 0;

    if (!hasField) {
      if (simpleMode) {
        hasField = this.checkIfHasSimpleDataTypeFieldValue(values);
      } else {
        hasField = this.checkIfHasDataTypeFieldValue(values);
      }
    }
    return hasField;
  }

}




