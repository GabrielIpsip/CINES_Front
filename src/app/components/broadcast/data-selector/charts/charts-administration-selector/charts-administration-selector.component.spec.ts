import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartsAdministrationSelectorComponent } from './charts-administration-selector.component';

describe('ChartsAdministrationSelectorComponent', () => {
  let component: ChartsAdministrationSelectorComponent;
  let fixture: ComponentFixture<ChartsAdministrationSelectorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChartsAdministrationSelectorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartsAdministrationSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
