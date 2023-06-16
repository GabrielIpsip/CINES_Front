import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibraryViewComponent } from './physical-library-view.component';

describe('PhysicalLibraryViewComponent', () => {
  let component: PhysicalLibraryViewComponent;
  let fixture: ComponentFixture<PhysicalLibraryViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
