import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GroupInstructionDialogComponent } from './group-instruction-dialog.component';

describe('GroupInstructionDialogComponent', () => {
  let component: GroupInstructionDialogComponent;
  let fixture: ComponentFixture<GroupInstructionDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupInstructionDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupInstructionDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
