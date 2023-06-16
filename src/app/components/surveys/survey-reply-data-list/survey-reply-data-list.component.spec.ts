import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyReplyDataListComponent } from './survey-reply-data-list.component';

describe('SurveyReplyDataListComponent', () => {
  let component: SurveyReplyDataListComponent;
  let fixture: ComponentFixture<SurveyReplyDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyReplyDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyReplyDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
