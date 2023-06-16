import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupConfigDataComponent } from './group-config-data.component';

describe('GroupConfigDataComponent', () => {
  let component: GroupConfigDataComponent;
  let fixture: ComponentFixture<GroupConfigDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupConfigDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupConfigDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
