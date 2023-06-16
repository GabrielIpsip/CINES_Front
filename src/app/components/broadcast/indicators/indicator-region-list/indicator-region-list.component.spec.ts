import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorRegionListComponent } from './indicator-region-list.component';

describe('IndicatorRegionListComponent', () => {
  let component: IndicatorRegionListComponent;
  let fixture: ComponentFixture<IndicatorRegionListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorRegionListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorRegionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
