import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditorialRouteEditorComponent } from './editorial-route-editor.component';

describe('EditorialRouteEditorComponent', () => {
  let component: EditorialRouteEditorComponent;
  let fixture: ComponentFixture<EditorialRouteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditorialRouteEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditorialRouteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
