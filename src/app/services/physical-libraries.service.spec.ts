import { TestBed } from '@angular/core/testing';

import { PhysicalLibrariesService } from './physical-libraries.service';

describe('PhysicalLibrariesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysicalLibrariesService = TestBed.get(PhysicalLibrariesService);
    expect(service).toBeTruthy();
  });
});
