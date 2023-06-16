import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidUserComponent } from './valid-user.component';

describe('ValidUserComponent', () => {
  let component: ValidUserComponent;
  let fixture: ComponentFixture<ValidUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValidUserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
