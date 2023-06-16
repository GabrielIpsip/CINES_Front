import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeViewComponent } from './data-type-view.component';

describe('DataTypeViewComponent', () => {
  let component: DataTypeViewComponent;
  let fixture: ComponentFixture<DataTypeViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
