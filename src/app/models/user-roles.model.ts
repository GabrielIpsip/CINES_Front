import { Roles } from './roles.model';
import { Users } from './users.model';
import { DocumentaryStructures } from './documentary-structures.model';

export class UserRoles {
  id: number;
  role: Roles;
  user: Users;
  documentaryStructure: DocumentaryStructures;
}
