import { DocumentaryStructures } from './documentary-structures.model';
import { PhysicalLibraries } from './physical-libraries.model';

export class PhysicalLibraryLinkHistory {
    physicLib: PhysicalLibraries;
    surveyId: number;
    docStruct: DocumentaryStructures;
}
