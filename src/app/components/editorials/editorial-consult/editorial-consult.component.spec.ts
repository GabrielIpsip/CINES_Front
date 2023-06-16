import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialConsultComponent } from './editorial-consult.component';

describe('EditorialConsultComponent', () => {
  let component: EditorialConsultComponent;
  let fixture: ComponentFixture<EditorialConsultComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialConsultComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
