import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeNumberViewComponent } from './data-type-number-view.component';

describe('DataTypeNumberViewComponent', () => {
  let component: DataTypeNumberViewComponent;
  let fixture: ComponentFixture<DataTypeNumberViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeNumberViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeNumberViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
