import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibraryDocStructSearchListComponent } from './physical-library-doc-struct-search-list.component';

describe('PhysicalLibraryDocStructSearchListComponent', () => {
  let component: PhysicalLibraryDocStructSearchListComponent;
  let fixture: ComponentFixture<PhysicalLibraryDocStructSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryDocStructSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryDocStructSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
