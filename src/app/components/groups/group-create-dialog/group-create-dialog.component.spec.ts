import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupCreateDialogComponent } from './group-create-dialog.component';

describe('GroupCreateDialogComponent', () => {
  let component: GroupCreateDialogComponent;
  let fixture: ComponentFixture<GroupCreateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupCreateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
