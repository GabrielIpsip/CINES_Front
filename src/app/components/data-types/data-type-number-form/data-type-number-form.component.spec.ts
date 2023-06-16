import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeNumberFormComponent } from './data-type-number-form.component';

describe('DataTypeNumberFormComponent', () => {
  let component: DataTypeNumberFormComponent;
  let fixture: ComponentFixture<DataTypeNumberFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeNumberFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeNumberFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
