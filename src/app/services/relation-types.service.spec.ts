import { TestBed } from '@angular/core/testing';

import { RelationTypesService } from './relation-types.service';

describe('RelationTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RelationTypesService = TestBed.get(RelationTypesService);
    expect(service).toBeTruthy();
  });
});
