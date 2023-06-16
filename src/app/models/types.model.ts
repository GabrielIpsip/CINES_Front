import { TypesEnum } from '../common/typesEnum.enum';

export class Types {
  id: number;
  name: TypesEnum;

  constructor(type?: Types) {
    if (type == null) {
      return;
    }

    this.id = type.id;
    this.name = type.name;
  }

  equals(type: Types) {
    return type.id === this.id
      && type.name === this.name;
  }
}
