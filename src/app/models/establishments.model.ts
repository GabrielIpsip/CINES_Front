import { EstablishmentTypes } from './establishment-types.model';
import { Administrations } from './administrations.model';
import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { Departments } from './departments.model';

export class Establishments implements Administrations {

  readonly CLASS_NAME = 'Establishments';
  readonly TYPE_NAME = AdministrationTypesEnum.ESTABLISHMENT;
  readonly PARAMETER_NAME = 'establishment';
  readonly KEBAB_CASE_NAME = 'establishment';
  readonly KEBAB_CASE_NAME_PLURAL = 'establishments';

  id: number;
  officialName: string;
  useName: string;
  acronym: string;
  brand: string;
  active: boolean;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  type: EstablishmentTypes;
  department: Departments;
  instruction: string;
  progress: number;
  totalProgress: number;

  constructor(establishment?: Establishments) {
    if (establishment == null) {
      this.type = new EstablishmentTypes();
      this.department = new Departments();
    } else {
      this.id = establishment.id;
      this.officialName = establishment.officialName;
      this.useName = establishment.useName;
      this.acronym = establishment.acronym;
      this.brand = establishment.brand;
      this.active = establishment.active;
      this.address = establishment.address;
      this.city = establishment.city;
      this.postalCode = establishment.postalCode;
      this.website = establishment.website;
      this.type = establishment.type;
      this.department = establishment.department;
      this.instruction = establishment.instruction;
    }
  }

  getAssociatedDocStructId(): number {
    return -1;
  }

}
