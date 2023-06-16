import { TestBed } from '@angular/core/testing';

import { BroadcastInstitutionsService } from './broadcast-institutions.service';

describe('InstitutionsService', () => {
  let service: BroadcastInstitutionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BroadcastInstitutionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
