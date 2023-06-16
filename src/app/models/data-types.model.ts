import { Types } from './types.model';
import { Constraints } from './constraints.model';

export class DataTypes {
    id: number;
    name: string;
    code: string;
    codeEu: string;
    measureUnit: string;
    groupId: number;
    groupOrder: number;
    date: string;
    administrator: boolean;
    private: boolean;
    facet: boolean;
    simplifiedFacet: boolean;
    instruction: string;
    definition: string;
    type: Types;
    constraint: Constraints;
}
