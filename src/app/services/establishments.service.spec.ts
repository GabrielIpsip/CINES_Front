import { TestBed } from '@angular/core/testing';

import { EstablishmentsService } from './establishments.service';

describe('EstablishmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EstablishmentsService = TestBed.get(EstablishmentsService);
    expect(service).toBeTruthy();
  });
});
