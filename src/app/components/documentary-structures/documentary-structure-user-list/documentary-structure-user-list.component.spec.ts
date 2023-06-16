import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentaryStructureUserListComponent } from './documentary-structure-user-list.component';

describe('DocumentaryStructureUserListComponent', () => {
  let component: DocumentaryStructureUserListComponent;
  let fixture: ComponentFixture<DocumentaryStructureUserListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocumentaryStructureUserListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentaryStructureUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
