import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsSelectorComponent } from './charts-selector.component';

describe('ChartsListComponent', () => {
  let component: ChartsSelectorComponent;
  let fixture: ComponentFixture<ChartsSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
