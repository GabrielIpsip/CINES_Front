import { TestBed } from '@angular/core/testing';

import { DocumentaryStructuresService } from './documentary-structures.service';

describe('DocumentaryStructuresServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentaryStructuresService = TestBed.get(DocumentaryStructuresService);
    expect(service).toBeTruthy();
  });
});
