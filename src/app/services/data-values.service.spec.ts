import { TestBed } from '@angular/core/testing';

import { DataValuesService } from './data-values.service';

describe('DataValuesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataValuesService = TestBed.get(DataValuesService);
    expect(service).toBeTruthy();
  });
});
