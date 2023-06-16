import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeCreateDialogComponent } from './data-type-create-dialog.component';

describe('DataTypeCreateDialogComponent', () => {
  let component: DataTypeCreateDialogComponent;
  let fixture: ComponentFixture<DataTypeCreateDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeCreateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
