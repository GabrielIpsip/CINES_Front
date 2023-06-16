import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyConsultComponent } from './survey-consult.component';

describe('SurveyConsultComponent', () => {
  let component: SurveyConsultComponent;
  let fixture: ComponentFixture<SurveyConsultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
