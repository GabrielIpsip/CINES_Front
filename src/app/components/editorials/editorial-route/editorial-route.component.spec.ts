import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialRouteComponent } from './editorial-route.component';

describe('EditorialRouteComponent', () => {
  let component: EditorialRouteComponent;
  let fixture: ComponentFixture<EditorialRouteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialRouteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialRouteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
