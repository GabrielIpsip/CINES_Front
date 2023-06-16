import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureRelationDialogComponent } from './documentary-structure-relation-dialog.component';

describe('DocumentaryStructureRelationDialogComponent', () => {
  let component: DocumentaryStructureRelationDialogComponent;
  let fixture: ComponentFixture<DocumentaryStructureRelationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureRelationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureRelationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
