import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeBooleanFormComponent } from './data-type-boolean-form.component';

describe('DataTypeBooleanFormComponent', () => {
  let component: DataTypeBooleanFormComponent;
  let fixture: ComponentFixture<DataTypeBooleanFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeBooleanFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeBooleanFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
