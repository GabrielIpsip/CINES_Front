import { FormGroup } from '@angular/forms';
import { AdministrationTypesEnum } from 'src/app/common/administration-types.enum';
import { DataSelectorService } from 'src/app/services/broadcast/data-selector.service';
import { CommonDataSelector } from './common-data-selector';

export class PhysicLibDataSelector extends CommonDataSelector {

  constructor(
    searchFields: FormGroup,
    private physicLibPath: string,
    dataSelectorService: DataSelectorService
  ) {
    super(searchFields, AdministrationTypesEnum.PHYSIC_LIB, dataSelectorService, physicLibPath);
  }

  onChangeFictitiousForm(query: any, fictitious: boolean) {
    if (fictitious == null) {
      return;
    }

    const fictitiousIndex = this.physicLibPath + '.fictitious';

    const term = { term: { [fictitiousIndex]: fictitious } };
    query.bool.must.push(term);
  }

  onChangeNameForm(query: any, name: string, exact: boolean) {
    if (name == null || name.length === 0) {
      return;
    }

    const match = {
      multi_match: {
        query: name,
        fields: [`${this.physicLibPath}.officialName`, `${this.physicLibPath}.useName`]
      }
    };

    this.addParamIfExactOrNot(match.multi_match, exact);

    query.bool.must.push(match);
  }

  onChangePostalCodeForm(query: any, postalCode: string) {
    if (postalCode == null || postalCode.length === 0) {
      return;
    }

    const postalCodeIndex = this.physicLibPath + '.postalCode';

    const term = { prefix: { [postalCodeIndex]: postalCode } };
    query.bool.must.push(term);

  }

  onChangeFictitiousCheckBox(query: any, fictitious: boolean, physical: boolean) {
    if (fictitious && physical) {
      return;
    }

    if (!fictitious && !physical) {
      fictitious = true;
      physical = true;
    }

    const fictitiousIndex = this.physicLibPath + '.fictitious';
    if (fictitious) {
      const term = { term: { [fictitiousIndex]: true } };
      query.bool.must.push(term);
    }

    if (physical) {
      const term = { term: { [fictitiousIndex]: false } };
      query.bool.must.push(term);
    }
  }

  onChangeAddressForm(query: any, address: string) {
    if (address == null || address.length === 0) {
      return;
    }

    const match = {
      multi_match: {
        query: address,
        fields: [`${this.physicLibPath}.address`, `${this.physicLibPath}.city`, `${this.physicLibPath}.department`,
        `${this.physicLibPath}.region`]
      }
    };

    query.bool.must.push(match);
  }

  onChangeDepartmentForm(query: any, department: string[]) {
    if (department == null || department.length === 0) {
      return;
    }

    const departmentIndex = this.physicLibPath + '.department';

    const term = { terms: { [departmentIndex]: department } };
    query.bool.must.push(term);
  }

  onChangeRegionForm(query: any, region: string[]) {
    if (region == null || region.length === 0) {
      return;
    }

    const regionIndex = this.physicLibPath + '.region';

    const term = { terms: { [regionIndex]: region } };
    query.bool.must.push(term);
  }

  hasNestedFieldPhysicLib(values: any, simpleMode: boolean): boolean {
    let hasField = values.physicLibNameForm?.length > 0
      || values.physicLibPostalCodeForm?.length > 0
      || values.physicLibAddressForm?.length > 0
      || values.physicLibDepartmentForm?.length > 0
      || values.physicLibRegionForm?.length > 0
      || !values.physicLibFictitiousCheckBox
      || !values.physicLibPhysicalCheckBox;

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
