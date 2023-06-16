import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorVisualizeTableComponent } from './data-selector-visualize-table.component';

describe('DataSelectorVisualizeTableComponent', () => {
  let component: DataSelectorVisualizeTableComponent;
  let fixture: ComponentFixture<DataSelectorVisualizeTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorVisualizeTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorVisualizeTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
