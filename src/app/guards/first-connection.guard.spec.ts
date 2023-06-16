import { TestBed, inject } from '@angular/core/testing';

import { FirstConnectionGuard } from './first-connection.guard';

describe('FirstConnectionGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirstConnectionGuard]
    });
  });

  it('should ...', inject([FirstConnectionGuard], (guard: FirstConnectionGuard) => {
    expect(guard).toBeTruthy();
  }));
});
