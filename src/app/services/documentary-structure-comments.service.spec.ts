import { TestBed } from '@angular/core/testing';

import { DocumentaryStructureCommentsService } from './documentary-structure-comments.service';

describe('DocumentaryStructureCommentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DocumentaryStructureCommentsService = TestBed.get(DocumentaryStructureCommentsService);
    expect(service).toBeTruthy();
  });
});
