import { TestBed, inject } from '@angular/core/testing';

import { RightsCheckerGuard } from './rights-checker.guard';

describe('RightsCheckerGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RightsCheckerGuard]
    });
  });

  it('should ...', inject([RightsCheckerGuard], (guard: RightsCheckerGuard) => {
    expect(guard).toBeTruthy();
  }));
});
