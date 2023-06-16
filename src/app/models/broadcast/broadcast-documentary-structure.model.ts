import { BroadcastAdministration } from './broadcast-administration.model';
import { BroadcastPhysicalLibrary } from './broadcast-physical-library.model';

export class BroadcastDocumentaryStructure implements BroadcastAdministration {
  year: string;
  id: number;
  officialName: string;
  useName: string;
  acronym: string;
  address: string;
  postalCode: string;
  city: string;
  website: string;
  instruction: string;
  institutionsId: number;
  institutionsUseName: string;
  physicalLibraries: BroadcastPhysicalLibrary[];

  constructor() {
    this.id = 0;
    this.year = '';
    this.officialName = '';
    this.useName = '';
    this.acronym = '';
    this.address = '';
    this.city = '';
    this.postalCode = '';
    this.website = '';
    this.instruction = '';
    this.physicalLibraries = [];
    this.institutionsId = 0;
    this.institutionsUseName = '';
  }
}
