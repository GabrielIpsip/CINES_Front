import { AdministrationTypesEnum } from '../common/administration-types.enum';

export class AdministrationTypes {
  id: number;
  name: AdministrationTypesEnum;

  constructor(type?: AdministrationTypes) {
    if (type == null) {
      return;
    }
    this.id = type.id;
    this.name = type.name;
  }

  equals(type: AdministrationTypes): boolean {
    return this.id === type.id
      && this.name === type.name;
  }

}
