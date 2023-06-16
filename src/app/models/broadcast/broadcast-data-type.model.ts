import { BroadcastTypeEnum } from 'src/app/common/broadcast/broadcast-type-enum';

export class BroadcastDataType {
  type: BroadcastTypeEnum;
  name: string;
  measureUnit: string;
  code: string;

  constructor(type: BroadcastTypeEnum, name: string, measureUnit: string, code: string) {
    this.type = type;
    this.name = name;
    this.measureUnit = measureUnit;
    this.code = code;
  }
}
