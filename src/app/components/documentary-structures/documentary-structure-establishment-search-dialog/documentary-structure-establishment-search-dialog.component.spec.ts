import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureEstablishmentSearchDialogComponent } from './documentary-structure-establishment-search-dialog.component';

describe('DocumentaryStructureEstablishmentSearchDialogComponent', () => {
  let component: DocumentaryStructureEstablishmentSearchDialogComponent;
  let fixture: ComponentFixture<DocumentaryStructureEstablishmentSearchDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureEstablishmentSearchDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureEstablishmentSearchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
