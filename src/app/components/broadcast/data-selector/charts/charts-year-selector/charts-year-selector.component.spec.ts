import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsYearSelectorComponent } from './charts-year-selector.component';

describe('ChartsYearSelectorComponent', () => {
  let component: ChartsYearSelectorComponent;
  let fixture: ComponentFixture<ChartsYearSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsYearSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsYearSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
