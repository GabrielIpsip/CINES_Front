import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserRoleRequestsComponent } from './user-role-requests.component';

describe('UserRoleRequestsComponent', () => {
  let component: UserRoleRequestsComponent;
  let fixture: ComponentFixture<UserRoleRequestsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleRequestsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
