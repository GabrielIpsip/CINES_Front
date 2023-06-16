import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureCreateComponent } from './documentary-structure-create.component';

describe('DocumentaryStructureCreateComponent', () => {
  let component: DocumentaryStructureCreateComponent;
  let fixture: ComponentFixture<DocumentaryStructureCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
