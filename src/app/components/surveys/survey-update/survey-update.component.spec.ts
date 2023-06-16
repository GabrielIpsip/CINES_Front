import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SurveyUpdateComponent } from './survey-update.component';

describe('SurveyUpdateComponent', () => {
  let component: SurveyUpdateComponent;
  let fixture: ComponentFixture<SurveyUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SurveyUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SurveyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
