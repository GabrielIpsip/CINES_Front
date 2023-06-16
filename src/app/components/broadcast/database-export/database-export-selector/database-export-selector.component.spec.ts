import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DatabaseExportSelectorComponent } from './database-export-selector.component';

describe('DatabaseExportSelectorComponent', () => {
  let component: DatabaseExportSelectorComponent;
  let fixture: ComponentFixture<DatabaseExportSelectorComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DatabaseExportSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseExportSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
