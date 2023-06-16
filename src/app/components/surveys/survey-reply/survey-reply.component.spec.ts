import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyReplyComponent } from './survey-reply.component';

describe('SurveyReplyComponent', () => {
  let component: SurveyReplyComponent;
  let fixture: ComponentFixture<SurveyReplyComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyReplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
