import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorCardChartComponent } from './indicator-card-chart.component';

describe('IndicatorCardChartComponent', () => {
  let component: IndicatorCardChartComponent;
  let fixture: ComponentFixture<IndicatorCardChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorCardChartComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorCardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
