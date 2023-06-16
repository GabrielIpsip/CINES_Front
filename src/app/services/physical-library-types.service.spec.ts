import { TestBed } from '@angular/core/testing';

import { PhysicalLibraryTypesService } from './physical-library-types.service';

describe('PhysicalLibraryTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PhysicalLibraryTypesService = TestBed.get(PhysicalLibraryTypesService);
    expect(service).toBeTruthy();
  });
});
