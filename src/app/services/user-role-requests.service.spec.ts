import { TestBed } from '@angular/core/testing';

import { UserRoleRequestsService } from './user-role-requests.service';

describe('UserRoleRequestsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UserRoleRequestsService = TestBed.get(UserRoleRequestsService);
    expect(service).toBeTruthy();
  });
});
