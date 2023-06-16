import { TestBed } from '@angular/core/testing';

import { DocumentaryStructureLinkHistoryService } from './documentary-structure-link-history.service';

describe('DocumentaryStructureLinkHistoryService', () => {
  let service: DocumentaryStructureLinkHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocumentaryStructureLinkHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
