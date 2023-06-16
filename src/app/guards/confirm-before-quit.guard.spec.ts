import { TestBed, inject } from '@angular/core/testing';

import { ConfirmBeforeQuitGuard } from './confirm-before-quit.guard';

describe('ConfirmBeforeQuitGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConfirmBeforeQuitGuard]
    });
  });

  it('should ...', inject([ConfirmBeforeQuitGuard], (guard: ConfirmBeforeQuitGuard) => {
    expect(guard).toBeTruthy();
  }));
});
