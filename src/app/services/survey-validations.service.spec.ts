import { TestBed } from '@angular/core/testing';

import { SurveyValidationsService } from './survey-validations.service';

describe('SurveyValidationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SurveyValidationsService = TestBed.get(SurveyValidationsService);
    expect(service).toBeTruthy();
  });
});
