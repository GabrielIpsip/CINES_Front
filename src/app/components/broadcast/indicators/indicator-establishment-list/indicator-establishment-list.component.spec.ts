import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorEstablishmentListComponent } from './indicator-establishment-list.component';

describe('IndicatorEstablishmentListComponent', () => {
  let component: IndicatorEstablishmentListComponent;
  let fixture: ComponentFixture<IndicatorEstablishmentListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorEstablishmentListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorEstablishmentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
