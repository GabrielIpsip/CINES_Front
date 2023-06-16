import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibraryUpdateComponent } from './physical-library-update.component';

describe('PhysicalLibraryUpdateComponent', () => {
  let component: PhysicalLibraryUpdateComponent;
  let fixture: ComponentFixture<PhysicalLibraryUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
