import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureSearchListComponent } from './documentary-structure-search-list.component';

describe('DocumentaryStructureSearchListComponent', () => {
  let component: DocumentaryStructureSearchListComponent;
  let fixture: ComponentFixture<DocumentaryStructureSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
