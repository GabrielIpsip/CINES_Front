import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialRouteEditComponent } from './editorial-route-edit.component';

describe('EditorialRouteEditComponent', () => {
  let component: EditorialRouteEditComponent;
  let fixture: ComponentFixture<EditorialRouteEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialRouteEditComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialRouteEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
