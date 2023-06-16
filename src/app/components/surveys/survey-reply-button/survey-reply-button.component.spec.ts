import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyReplyButtonComponent } from './survey-reply-button.component';

describe('SurveyReplyButtonComponent', () => {
  let component: SurveyReplyButtonComponent;
  let fixture: ComponentFixture<SurveyReplyButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyReplyButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReplyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
