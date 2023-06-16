import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeTextFormComponent } from './data-type-text-form.component';

describe('DataTypeTextFormComponent', () => {
  let component: DataTypeTextFormComponent;
  let fixture: ComponentFixture<DataTypeTextFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeTextFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeTextFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
