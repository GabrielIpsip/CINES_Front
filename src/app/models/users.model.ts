export class Users {
  id: number;
  eppn: string;
  mail: string;
  phone: string;
  firstname: string;
  lastname: string;
  active: boolean;
  valid: boolean;

  csrfToken?: {
    id: string;
    value: string;
  };

  constructor(user?: Users) {
    if (user == null) {
      return;
    }

    this.id = user.id;
    this.eppn = user.eppn;
    this.mail = user.mail;
    this.phone = user.phone;
    this.firstname = user.firstname;
    this.lastname = user.lastname;
    this.active = user.active;
  }

  equals(user: Users) {
    return this.eppn === user.eppn &&
      this.mail === user.mail &&
      this.phone === user.phone &&
      this.firstname === user.firstname &&
      this.lastname === user.lastname &&
      this.active === user.active;
  }
}
