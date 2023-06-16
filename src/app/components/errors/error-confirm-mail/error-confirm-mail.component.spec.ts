import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ErrorConfirmMailComponent } from './error-confirm-mail.component';

describe('ErrorConfirmMailComponent', () => {
  let component: ErrorConfirmMailComponent;
  let fixture: ComponentFixture<ErrorConfirmMailComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ErrorConfirmMailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorConfirmMailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
