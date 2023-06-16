import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorGlobalListComponent } from './indicator-global-list.component';

describe('IndicatorKeyFigureListComponent', () => {
  let component: IndicatorGlobalListComponent;
  let fixture: ComponentFixture<IndicatorGlobalListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorGlobalListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorGlobalListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
