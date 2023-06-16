import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeFormComponent } from './data-type-form.component';

describe('DataTypeFormComponent', () => {
  let component: DataTypeFormComponent;
  let fixture: ComponentFixture<DataTypeFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
