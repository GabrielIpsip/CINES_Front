import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureRelationSearchListComponent } from './documentary-structure-relation-search-list.component';

describe('DocumentaryStructureRelationSearchListComponent', () => {
  let component: DocumentaryStructureRelationSearchListComponent;
  let fixture: ComponentFixture<DocumentaryStructureRelationSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureRelationSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureRelationSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
