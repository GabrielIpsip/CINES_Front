import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserConsultComponent } from './user-consult.component';

describe('UserConsultComponent', () => {
  let component: UserConsultComponent;
  let fixture: ComponentFixture<UserConsultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UserConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
