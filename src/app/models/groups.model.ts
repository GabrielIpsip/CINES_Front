import { AdministrationTypes } from './administration-types.model';

export class Groups {
  id: number;
  parentGroupId: number;
  title: string;
  administrationType: AdministrationTypes;

  constructor(group?: Groups) {
    if (group == null) {
      this.administrationType = new AdministrationTypes();
      return;
    }

    this.id = group.id;
    this.parentGroupId = group.parentGroupId;
    this.title = group.title;
    this.administrationType = group.administrationType;
  }

  equals(group: Groups): boolean {
    this.administrationType = new AdministrationTypes(this.administrationType);
    group.administrationType = new AdministrationTypes(group.administrationType);

    return this.id === group.id
      && this.parentGroupId === group.parentGroupId
      && this.title === group.title
      && this.administrationType.equals(group.administrationType);
  }
}
