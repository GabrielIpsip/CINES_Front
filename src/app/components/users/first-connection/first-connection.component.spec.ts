import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FirstConnectionComponent } from './first-connection.component';

describe('FirstConnectionComponent', () => {
  let component: FirstConnectionComponent;
  let fixture: ComponentFixture<FirstConnectionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FirstConnectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FirstConnectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
