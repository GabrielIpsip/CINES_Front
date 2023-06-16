import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibrarySearchComponent } from './physical-library-search.component';

describe('PhysicalLibrarySearchComponent', () => {
  let component: PhysicalLibrarySearchComponent;
  let fixture: ComponentFixture<PhysicalLibrarySearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibrarySearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibrarySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
