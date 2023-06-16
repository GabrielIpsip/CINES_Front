import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeOperationFormComponent } from './data-type-operation-form.component';

describe('DataTypeOperationFormComponent', () => {
  let component: DataTypeOperationFormComponent;
  let fixture: ComponentFixture<DataTypeOperationFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeOperationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeOperationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
