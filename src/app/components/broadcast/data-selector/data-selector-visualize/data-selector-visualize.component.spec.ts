import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorVisualizeComponent } from './data-selector-visualize.component';

describe('DataSelectorVisualizeComponent', () => {
  let component: DataSelectorVisualizeComponent;
  let fixture: ComponentFixture<DataSelectorVisualizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorVisualizeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorVisualizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
