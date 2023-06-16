import { Establishments } from './establishments.model';
import { RelationTypes } from './relation-types.model';

export class EstablishmentRelations {
    startDate: Date;
    endDate: Date;
    originEstablishment: Establishments;
    resultEstablishment: Establishments;
    type: RelationTypes;
}
