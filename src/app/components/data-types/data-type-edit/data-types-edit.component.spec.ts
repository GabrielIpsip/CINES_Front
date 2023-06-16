import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypesEditComponent } from './data-type-edit.component';

describe('DataTypesEditComponent', () => {
  let component: DataTypesEditComponent;
  let fixture: ComponentFixture<DataTypesEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypesEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypesEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
