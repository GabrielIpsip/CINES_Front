import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyReplyProgressStatusComponent } from './survey-reply-progress-status.component';

describe('SurveyReplyProgressStatusComponent', () => {
  let component: SurveyReplyProgressStatusComponent;
  let fixture: ComponentFixture<SurveyReplyProgressStatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SurveyReplyProgressStatusComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReplyProgressStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
