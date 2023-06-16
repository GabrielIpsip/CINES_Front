import { Administrations } from './administrations.model';
import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { Departments } from './departments.model';

export class PhysicalLibraries implements Administrations {

  readonly CLASS_NAME = 'PhysicalLibraries';
  readonly TYPE_NAME = AdministrationTypesEnum.PHYSIC_LIB;
  readonly PARAMETER_NAME = 'physicLib';
  readonly KEBAB_CASE_NAME = 'physical-library';
  readonly KEBAB_CASE_NAME_PLURAL = 'physical-libraries';

  id: number;
  useName: string;

  officialName: string;
  address: string;
  city: string;
  postalCode: string;
  active: boolean;
  instruction: string;
  sortOrder: number;
  fictitious: boolean;
  docStructId: number;
  department: Departments;
  progress: boolean;

  constructor(physicLib?: PhysicalLibraries) {
    if (physicLib == null) {
      this.department = new Departments();
    } else {
      this.id = physicLib.id;
      this.officialName = physicLib.officialName;
      this.useName = physicLib.useName;
      this.active = physicLib.active;
      this.address = physicLib.address;
      this.city = physicLib.city;
      this.postalCode = physicLib.postalCode;
      this.sortOrder = physicLib.sortOrder;
      this.fictitious = physicLib.fictitious;
      this.docStructId = physicLib.docStructId;
      this.department = physicLib.department;
      this.instruction = physicLib.instruction;
    }
  }

  getAssociatedDocStructId(): number {
    return this.docStructId;
  }
}
