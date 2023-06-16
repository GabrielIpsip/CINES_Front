import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserRoleListComponent } from './user-role-list.component';

describe('UserRoleListComponent', () => {
  let component: UserRoleListComponent;
  let fixture: ComponentFixture<UserRoleListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserRoleListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRoleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
