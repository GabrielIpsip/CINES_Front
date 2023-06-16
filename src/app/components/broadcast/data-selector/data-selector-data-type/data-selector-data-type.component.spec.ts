import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorDataTypeComponent } from './data-selector-data-type.component';

describe('DataSelectorDataTypeComponent', () => {
  let component: DataSelectorDataTypeComponent;
  let fixture: ComponentFixture<DataSelectorDataTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorDataTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorDataTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
