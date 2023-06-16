import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorSimpleDataTypeComponent } from './data-selector-simple-data-type.component';

describe('DataSelectorSimpleDataTypeComponent', () => {
  let component: DataSelectorSimpleDataTypeComponent;
  let fixture: ComponentFixture<DataSelectorSimpleDataTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorSimpleDataTypeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorSimpleDataTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
