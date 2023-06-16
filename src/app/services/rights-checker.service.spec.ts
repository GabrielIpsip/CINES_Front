import { TestBed } from '@angular/core/testing';

import { RightsCheckerService } from './rights-checker.service';

describe('RightsCheckerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RightsCheckerService = TestBed.get(RightsCheckerService);
    expect(service).toBeTruthy();
  });
});
