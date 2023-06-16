import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatabaseExportComponent } from './database-export/database-export.component';

describe('ExportDatabaseComponent', () => {
  let component: DatabaseExportComponent;
  let fixture: ComponentFixture<DatabaseExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DatabaseExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatabaseExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
