import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialUpdateComponent } from './editorial-update.component';

describe('EditorialUpdateComponent', () => {
  let component: EditorialUpdateComponent;
  let fixture: ComponentFixture<EditorialUpdateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialUpdateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
