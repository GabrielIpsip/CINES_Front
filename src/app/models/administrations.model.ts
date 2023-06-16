import { AdministrationTypesEnum } from '../common/administration-types.enum';

export interface Administrations {

  readonly CLASS_NAME: string;
  readonly TYPE_NAME: AdministrationTypesEnum;
  readonly PARAMETER_NAME: string;
  readonly KEBAB_CASE_NAME: string;
  readonly KEBAB_CASE_NAME_PLURAL: string;

  id: number;
  officialName: string;
  useName: string;
  address: string;
  postalCode: string;
  city: string;
  active: boolean;
  instruction: string;

  getAssociatedDocStructId(): number;

}
