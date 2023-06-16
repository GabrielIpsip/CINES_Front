import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialFileListComponent } from './editorial-file-list.component';

describe('EditorialFileListComponent', () => {
  let component: EditorialFileListComponent;
  let fixture: ComponentFixture<EditorialFileListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialFileListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialFileListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
