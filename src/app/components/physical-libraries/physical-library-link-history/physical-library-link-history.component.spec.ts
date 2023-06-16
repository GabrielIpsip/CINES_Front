import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalLibraryLinkHistoryComponent } from './physical-library-link-history.component';

describe('PhysicalLibraryLinkHistoryComponent', () => {
  let component: PhysicalLibraryLinkHistoryComponent;
  let fixture: ComponentFixture<PhysicalLibraryLinkHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryLinkHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryLinkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
