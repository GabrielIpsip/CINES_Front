import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentRelationDialogComponent } from './establishment-relation-dialog.component';

describe('EstablishmentRelationDialogComponent', () => {
  let component: EstablishmentRelationDialogComponent;
  let fixture: ComponentFixture<EstablishmentRelationDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentRelationDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentRelationDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
