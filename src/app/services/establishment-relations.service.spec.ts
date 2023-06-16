import { TestBed } from '@angular/core/testing';

import { EstablishmentRelationsService } from './establishment-relations.service';

describe('EstablishmentRelationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstablishmentRelationsService = TestBed.get(EstablishmentRelationsService);
    expect(service).toBeTruthy();
  });
});
