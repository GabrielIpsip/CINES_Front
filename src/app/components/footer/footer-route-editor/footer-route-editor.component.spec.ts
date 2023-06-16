import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FooterRouteEditorComponent } from './footer-route-editor.component';

describe('FooterRouteEditorComponent', () => {
  let component: FooterRouteEditorComponent;
  let fixture: ComponentFixture<FooterRouteEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FooterRouteEditorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterRouteEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
