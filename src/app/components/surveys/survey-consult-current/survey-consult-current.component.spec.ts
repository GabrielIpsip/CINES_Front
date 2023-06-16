import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyConsultCurrentComponent } from './survey-consult-current.component';

describe('SurveyConsultCurrentComponent', () => {
  let component: SurveyConsultCurrentComponent;
  let fixture: ComponentFixture<SurveyConsultCurrentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConsultCurrentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConsultCurrentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
