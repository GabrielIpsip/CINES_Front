import { TestBed } from '@angular/core/testing';

import { DataTypesService } from './data-types.service';

describe('DataTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataTypesService = TestBed.get(DataTypesService);
    expect(service).toBeTruthy();
  });
});
