import { BroadcastAdministration } from './broadcast-administration.model';
import { BroadcastDocumentaryStructure } from './broadcast-documentary-structure.model';

export class BroadcastInstitution implements BroadcastAdministration {
  year: string;
  id: number;
  officialName: string;
  useName: string;
  acronym: string;
  brand: string;
  address: string;
  city: string;
  postalCode: string;
  website: string;
  type: string;
  instruction: string;
  documentaryStructures: BroadcastDocumentaryStructure[];


  constructor() {
    this.year = '';
    this.id = 0;
    this.officialName = '';
    this.useName = '';
    this.acronym = '';
    this.brand = '';
    this.address = '';
    this.city = '';
    this.postalCode = '';
    this.website = '';
    this.type = '';
    this.instruction = '';
    this.documentaryStructures = [];
  }
}
