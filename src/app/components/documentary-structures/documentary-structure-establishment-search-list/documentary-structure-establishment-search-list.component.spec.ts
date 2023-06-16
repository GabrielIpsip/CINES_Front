import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureEstablishmentSearchListComponent } from './documentary-structure-establishment-search-list.component';

describe('DocumentaryStructureEstablishmentSearchListComponent', () => {
  let component: DocumentaryStructureEstablishmentSearchListComponent;
  let fixture: ComponentFixture<DocumentaryStructureEstablishmentSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureEstablishmentSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureEstablishmentSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
