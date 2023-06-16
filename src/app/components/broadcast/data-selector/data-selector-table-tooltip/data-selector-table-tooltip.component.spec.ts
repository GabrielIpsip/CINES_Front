import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorTableTooltipComponent } from './data-selector-table-tooltip.component';

describe('DataSelectorTableTooltipComponent', () => {
  let component: DataSelectorTableTooltipComponent;
  let fixture: ComponentFixture<DataSelectorTableTooltipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorTableTooltipComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorTableTooltipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
