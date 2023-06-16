import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorExportTableComponent } from './data-selector-export-table.component';

describe('DataSelectorExportTableComponent', () => {
  let component: DataSelectorExportTableComponent;
  let fixture: ComponentFixture<DataSelectorExportTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorExportTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorExportTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
