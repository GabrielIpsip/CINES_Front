import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureViewComponent } from './documentary-structure-view.component';

describe('DocumentaryStructureViewComponent', () => {
  let component: DocumentaryStructureViewComponent;
  let fixture: ComponentFixture<DocumentaryStructureViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
