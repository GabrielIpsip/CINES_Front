import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorTypesComponent } from './data-selector-types.component';

describe('DataSelectorTypesComponent', () => {
  let component: DataSelectorTypesComponent;
  let fixture: ComponentFixture<DataSelectorTypesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorTypesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorTypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
