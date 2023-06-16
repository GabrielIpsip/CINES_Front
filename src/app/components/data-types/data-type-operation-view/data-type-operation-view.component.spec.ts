import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeOperationViewComponent } from './data-type-operation-view.component';

describe('DataTypeOperationViewComponent', () => {
  let component: DataTypeOperationViewComponent;
  let fixture: ComponentFixture<DataTypeOperationViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeOperationViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeOperationViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
