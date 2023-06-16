import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorDataTypeNumberComponent } from './data-selector-data-type-number.component';

describe('DataSelectorDataTypeNumberComponent', () => {
  let component: DataSelectorDataTypeNumberComponent;
  let fixture: ComponentFixture<DataSelectorDataTypeNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorDataTypeNumberComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorDataTypeNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
