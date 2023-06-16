import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorExportComponent } from './indicator-export.component';

describe('IndicatorExportComponent', () => {
  let component: IndicatorExportComponent;
  let fixture: ComponentFixture<IndicatorExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
