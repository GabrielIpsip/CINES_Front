import { TestBed } from '@angular/core/testing';

import { PhysicalLibraryLinkHistoryService } from './physical-library-link-history.service';

describe('PhysicalLibraryLinkHistoryService', () => {
  let service: PhysicalLibraryLinkHistoryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhysicalLibraryLinkHistoryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
