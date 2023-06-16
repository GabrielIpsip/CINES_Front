import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibraryDocStructSearchDialogComponent } from './physical-library-doc-struct-search-dialog.component';

describe('PhysicalLibraryDocStructSearchDialogComponent', () => {
  let component: PhysicalLibraryDocStructSearchDialogComponent;
  let fixture: ComponentFixture<PhysicalLibraryDocStructSearchDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryDocStructSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryDocStructSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
