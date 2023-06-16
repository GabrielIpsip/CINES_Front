import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ReturnButtonComponent } from './return-button.component';

describe('ReturnButtonComponent', () => {
  let component: ReturnButtonComponent;
  let fixture: ComponentFixture<ReturnButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
