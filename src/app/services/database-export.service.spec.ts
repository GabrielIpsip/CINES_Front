import { TestBed } from '@angular/core/testing';

import { DatabaseExportService } from './database-export.service';

describe('DatabaseExportService', () => {
  let service: DatabaseExportService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DatabaseExportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
