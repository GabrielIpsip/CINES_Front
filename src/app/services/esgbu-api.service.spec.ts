import { TestBed } from '@angular/core/testing';

import { EsgbuApiService } from './esgbu-api.service';

describe('EsgbuApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EsgbuApiService<any> = TestBed.get(EsgbuApiService);
    expect(service).toBeTruthy();
  });
});
