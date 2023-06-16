import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialListComponent } from './editorial-list.component';

describe('EditorialListComponent', () => {
  let component: EditorialListComponent;
  let fixture: ComponentFixture<EditorialListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
