import { Users } from 'src/app/models/users.model';

export interface IEnvironment {
  production: boolean;
  devMode?: boolean;
  testUser?: Users;
}
