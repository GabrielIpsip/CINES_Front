import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyConsultCurrentDocStructComponent } from './survey-consult-current-doc-struct.component';

describe('SurveyConsultCurrentDocStructComponent', () => {
  let component: SurveyConsultCurrentDocStructComponent;
  let fixture: ComponentFixture<SurveyConsultCurrentDocStructComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyConsultCurrentDocStructComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyConsultCurrentDocStructComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
