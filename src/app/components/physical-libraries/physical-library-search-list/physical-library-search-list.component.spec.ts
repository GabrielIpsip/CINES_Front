import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibrarySearchListComponent } from './physical-library-search-list.component';

describe('PhysicalLibrarySearchListComponent', () => {
  let component: PhysicalLibrarySearchListComponent;
  let fixture: ComponentFixture<PhysicalLibrarySearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibrarySearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibrarySearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
