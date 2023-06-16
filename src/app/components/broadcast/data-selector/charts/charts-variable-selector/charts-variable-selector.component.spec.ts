import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsVariableSelectorComponent } from './charts-variable-selector.component';

describe('ChartsVariableSelectorComponent', () => {
  let component: ChartsVariableSelectorComponent;
  let fixture: ComponentFixture<ChartsVariableSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsVariableSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsVariableSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
