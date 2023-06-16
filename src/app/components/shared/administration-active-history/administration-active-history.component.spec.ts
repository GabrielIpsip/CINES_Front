import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministrationActiveHistoryComponent } from './administration-active-history.component';

describe('AdministrationActiveHistoryComponent', () => {
  let component: AdministrationActiveHistoryComponent;
  let fixture: ComponentFixture<AdministrationActiveHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdministrationActiveHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdministrationActiveHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
