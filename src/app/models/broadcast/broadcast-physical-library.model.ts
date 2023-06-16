import { BroadcastAdministration } from './broadcast-administration.model';

export class BroadcastPhysicalLibrary implements BroadcastAdministration {
  year: string;
  id: number;
  officialName: string;
  useName: string;
  address: string;
  city: string;
  postalCode: string;
  instruction: string;
  sortOrder: number;
  fictitious: boolean;
  institutionsId: number;
  institutionsUseName: string;
  documentaryStructuresId: number;
  documentaryStructuresUseName: string;

  constructor() {
    this.id = 0;
    this.year = '';
    this.officialName = '';
    this.useName = '';
    this.address = '';
    this.city = '';
    this.postalCode = '';
    this.instruction = '';
    this.sortOrder = 0;
    this.fictitious = false;
    this.documentaryStructuresId = 0;
    this.documentaryStructuresUseName = '';
    this.institutionsId = 0;
    this.institutionsUseName = '';
  }
}
