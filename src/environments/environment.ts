import { Users } from 'src/app/models/users.model';
import { IEnvironment } from './IEnvironment';
// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment: IEnvironment = {
  production: false,
  devMode: true,
  testUser:
  {
    id: 2,
    lastname: 'TESTNAME',
    firstname: 'TESTUSERNAME',
    active: true,
    eppn: 'mail@server.fr',
    mail: 'mail@server.fr',
    phone: '0989876765',
    valid: false,

    equals(user: Users) {
      return this.eppn === user.eppn &&
        this.mail === user.mail &&
        this.phone === user.phone &&
        this.firstname === user.firstname &&
        this.lastname === user.lastname &&
        this.active === user.active;
    }
  }
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
