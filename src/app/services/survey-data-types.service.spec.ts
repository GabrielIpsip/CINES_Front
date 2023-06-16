import { TestBed } from '@angular/core/testing';

import { SurveyDataTypesService } from './survey-data-types.service';

describe('SurveyDataTypesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyDataTypesService = TestBed.get(SurveyDataTypesService);
    expect(service).toBeTruthy();
  });
});
