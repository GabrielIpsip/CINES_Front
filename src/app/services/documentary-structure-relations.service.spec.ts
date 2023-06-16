import { TestBed } from '@angular/core/testing';

import { DocumentaryStructureRelationsService } from './documentary-structure-relations.service';

describe('DocumentaryStructureRelationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentaryStructureRelationsService = TestBed.get(DocumentaryStructureRelationsService);
    expect(service).toBeTruthy();
  });
});
