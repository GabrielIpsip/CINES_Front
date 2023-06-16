import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseExportActiveSurveyComponent } from './database-export-active-survey.component';

describe('DatabaseExportActiveSurveyComponent', () => {
  let component: DatabaseExportActiveSurveyComponent;
  let fixture: ComponentFixture<DatabaseExportActiveSurveyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseExportActiveSurveyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseExportActiveSurveyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
