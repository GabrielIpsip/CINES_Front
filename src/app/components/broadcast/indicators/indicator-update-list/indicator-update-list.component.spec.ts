import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorUpdateListComponent } from './indicator-update-list.component';

describe('IndicatorUpdateListComponent', () => {
  let component: IndicatorUpdateListComponent;
  let fixture: ComponentFixture<IndicatorUpdateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorUpdateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorUpdateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
