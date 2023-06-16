import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserNotValidComponent } from './user-not-valid.component';

describe('UserNotValidComponent', () => {
  let component: UserNotValidComponent;
  let fixture: ComponentFixture<UserNotValidComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserNotValidComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserNotValidComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
