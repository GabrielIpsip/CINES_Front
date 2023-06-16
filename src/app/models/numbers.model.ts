import { Constraints } from './constraints.model';

export class Numbers implements Constraints {
    dataTypeId: number;
    min: number;
    max: number;
    minAlert: number;
    maxAlert: number;
    evolutionMin: number;
    evolutionMax: number;
    isDecimal: boolean;

    constructor(min?: number, max?: number, isDecimal?: boolean) {
        this.min = min;
        this.max = max;
        this.isDecimal = isDecimal;
    }
}
