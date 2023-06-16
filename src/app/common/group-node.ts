import { AdministrationTypes } from '../models/administration-types.model';

export class GroupNode {
  title: string;
  parentGroupId: number;
  id: number;
  children?: GroupNode[];
  color?: string;
  administrationType?: AdministrationTypes;
}
