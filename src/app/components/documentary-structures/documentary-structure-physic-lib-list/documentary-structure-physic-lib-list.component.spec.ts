import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DocumentaryStructurePhysicLibListComponent } from './documentary-structure-physic-lib-list.component';

describe('DocumentaryStructurePhysicLibListComponent', () => {
  let component: DocumentaryStructurePhysicLibListComponent;
  let fixture: ComponentFixture<DocumentaryStructurePhysicLibListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentaryStructurePhysicLibListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructurePhysicLibListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
