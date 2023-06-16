import { TestBed } from '@angular/core/testing';

import { TextsService } from './texts.service';

describe('TextsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TextsService = TestBed.get(TextsService);
    expect(service).toBeTruthy();
  });
});
