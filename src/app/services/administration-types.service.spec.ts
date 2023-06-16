import { TestBed } from '@angular/core/testing';

import { AdministrationTypesService } from './administration-types.service';

describe('AdministrationTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AdministrationTypesService = TestBed.get(AdministrationTypesService);
    expect(service).toBeTruthy();
  });
});
