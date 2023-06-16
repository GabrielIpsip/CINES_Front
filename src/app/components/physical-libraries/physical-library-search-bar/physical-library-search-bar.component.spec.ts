import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibrarySearchBarComponent } from './physical-library-search-bar.component';

describe('PhysicalLibrarySearchBarComponent', () => {
  let component: PhysicalLibrarySearchBarComponent;
  let fixture: ComponentFixture<PhysicalLibrarySearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibrarySearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibrarySearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
