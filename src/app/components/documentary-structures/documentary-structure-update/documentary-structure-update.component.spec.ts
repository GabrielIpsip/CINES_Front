import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructureUpdateComponent } from './documentary-structure-update.component';

describe('DocumentaryStructureUpdateComponent', () => {
  let component: DocumentaryStructureUpdateComponent;
  let fixture: ComponentFixture<DocumentaryStructureUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
