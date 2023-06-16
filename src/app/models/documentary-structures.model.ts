import { Administrations } from './administrations.model';
import { AdministrationTypesEnum } from '../common/administration-types.enum';
import { Departments } from './departments.model';

export class DocumentaryStructures implements Administrations {

    readonly CLASS_NAME = 'DocumentaryStructures';
    readonly TYPE_NAME = AdministrationTypesEnum.DOC_STRUCT;
    readonly PARAMETER_NAME = 'docStruct';
    readonly KEBAB_CASE_NAME = 'documentary-structure';
    readonly KEBAB_CASE_NAME_PLURAL = 'documentary-structures';

    id: number;
    officialName: string;
    useName: string;
    acronym: string;
    address: string;
    postalCode: string;
    city: string;
    website: string;
    active: boolean;
    establishmentId: number;
    department: Departments;
    instruction: string;
    progress: number;
    totalProgress: number;

    constructor(docStruct?: DocumentaryStructures) {
        if (docStruct == null) {
            this.department = new Departments();
        } else {
            this.id = docStruct.id;
            this.officialName = docStruct.officialName;
            this.useName = docStruct.useName;
            this.acronym = docStruct.acronym;
            this.active = docStruct.active;
            this.address = docStruct.address;
            this.city = docStruct.city;
            this.postalCode = docStruct.postalCode;
            this.website = docStruct.website;
            this.establishmentId = docStruct.establishmentId;
            this.department = docStruct.department;
            this.instruction = docStruct.instruction;
        }
    }

    getAssociatedDocStructId(): number {
      return this.id;
    }
}
