import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ExportAdministrationMenuComponent } from './export-administration-menu.component';

describe('ExportAdministrationMenuComponent', () => {
  let component: ExportAdministrationMenuComponent;
  let fixture: ComponentFixture<ExportAdministrationMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ExportAdministrationMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExportAdministrationMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
