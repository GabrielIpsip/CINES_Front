import { DocumentaryStructures } from './documentary-structures.model';
import { RelationTypes } from './relation-types.model';

export class DocumentaryStructureRelations {
    startDate: Date;
    endDate: Date;
    originDocumentaryStructure: DocumentaryStructures;
    resultDocumentaryStructure: DocumentaryStructures;
    type: RelationTypes;
}
