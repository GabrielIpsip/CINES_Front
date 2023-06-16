import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupConfigDataListComponent } from './group-config-data-list.component';

describe('GroupConfigDataListComponent', () => {
  let component: GroupConfigDataListComponent;
  let fixture: ComponentFixture<GroupConfigDataListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupConfigDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupConfigDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
