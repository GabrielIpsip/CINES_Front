import { Constraints } from './constraints.model';

export class Texts implements Constraints {
    dataTypeId: number;
    minLength: number;
    maxLength: number;
    regex: string;

    constructor(minLength?: number, maxLength?: number) {
        this.minLength = minLength;
        this.maxLength = maxLength;
    }
}
