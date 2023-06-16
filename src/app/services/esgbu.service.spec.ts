import { TestBed } from '@angular/core/testing';

import { ESGBUService } from './esgbu.service';

describe('ESGBUService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ESGBUService = TestBed.get(ESGBUService);
    expect(service).toBeTruthy();
  });
});
