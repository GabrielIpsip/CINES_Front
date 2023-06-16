import { TestBed } from '@angular/core/testing';

import { GroupInstructionsService } from './group-instructions.service';

describe('GroupInstructionsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GroupInstructionsService = TestBed.get(GroupInstructionsService);
    expect(service).toBeTruthy();
  });
});
