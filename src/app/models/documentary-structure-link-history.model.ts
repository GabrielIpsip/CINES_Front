import { DocumentaryStructures } from './documentary-structures.model';
import { Establishments } from './establishments.model';

export class DocumentaryStructureLinkHistory {
    docStruct: DocumentaryStructures;
    surveyId: number;
    establishment: Establishments;
}
