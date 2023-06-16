import { TestBed } from '@angular/core/testing';

import { EstablishmentTypesService } from './establishment-types.service';

describe('EstablishmentTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstablishmentTypesService = TestBed.get(EstablishmentTypesService);
    expect(service).toBeTruthy();
  });
});
