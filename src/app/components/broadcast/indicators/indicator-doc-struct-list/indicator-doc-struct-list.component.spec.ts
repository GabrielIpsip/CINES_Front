import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndicatorDocStructListComponent } from './indicator-doc-struct-list.component';

describe('IndicatorDocStructListComponent', () => {
  let component: IndicatorDocStructListComponent;
  let fixture: ComponentFixture<IndicatorDocStructListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ IndicatorDocStructListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(IndicatorDocStructListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
