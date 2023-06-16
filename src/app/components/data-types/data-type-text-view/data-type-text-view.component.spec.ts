import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DataTypeTextViewComponent } from './data-type-text-view.component';

describe('DataTypeTextViewComponent', () => {
  let component: DataTypeTextViewComponent;
  let fixture: ComponentFixture<DataTypeTextViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DataTypeTextViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataTypeTextViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
