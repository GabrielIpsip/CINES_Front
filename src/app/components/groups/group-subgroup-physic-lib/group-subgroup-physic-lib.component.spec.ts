import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupSubgroupPhysicLibComponent } from './group-subgroup-physic-lib.component';

describe('GroupSubgroupPhysicLibComponent', () => {
  let component: GroupSubgroupPhysicLibComponent;
  let fixture: ComponentFixture<GroupSubgroupPhysicLibComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupSubgroupPhysicLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupSubgroupPhysicLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
