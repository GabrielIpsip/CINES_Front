import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyCreateComponent } from './survey-create.component';

describe('SurveyCreateComponent', () => {
  let component: SurveyCreateComponent;
  let fixture: ComponentFixture<SurveyCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
