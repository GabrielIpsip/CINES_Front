import { DocumentaryStructures } from './documentary-structures.model';
import { Roles } from './roles.model';
import { Users } from './users.model';

export class UserRoleRequests {

  id: number;
  creation: string;
  documentaryStructure: DocumentaryStructures;
  role: Roles;
  user: Users;

}
