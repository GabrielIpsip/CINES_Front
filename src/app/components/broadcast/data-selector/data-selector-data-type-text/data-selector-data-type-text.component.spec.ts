import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorDataTypeTextComponent } from './data-selector-data-type-text.component';

describe('DataSelectorDataTypeTextComponent', () => {
  let component: DataSelectorDataTypeTextComponent;
  let fixture: ComponentFixture<DataSelectorDataTypeTextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorDataTypeTextComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorDataTypeTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
