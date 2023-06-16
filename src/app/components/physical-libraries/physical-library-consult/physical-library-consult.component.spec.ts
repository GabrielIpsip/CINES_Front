import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PhysicalLibraryConsultComponent } from './physical-library-consult.component';

describe('PhysicalLibraryConsultComponent', () => {
  let component: PhysicalLibraryConsultComponent;
  let fixture: ComponentFixture<PhysicalLibraryConsultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalLibraryConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalLibraryConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
