import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentaryStructureLinkHistoryComponent } from './documentary-structure-link-history.component';

describe('DocumentaryStructureLinkHistoryComponent', () => {
  let component: DocumentaryStructureLinkHistoryComponent;
  let fixture: ComponentFixture<DocumentaryStructureLinkHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureLinkHistoryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureLinkHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
