import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendConfirmationMailButtonComponent } from './send-confirmation-mail-button.component';

describe('SendConfirmationMailButtonComponent', () => {
  let component: SendConfirmationMailButtonComponent;
  let fixture: ComponentFixture<SendConfirmationMailButtonComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendConfirmationMailButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendConfirmationMailButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
