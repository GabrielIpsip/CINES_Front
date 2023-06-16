import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentUpdateComponent as EstablishmentUpdateComponent } from './establishment-update.component';

describe('EstablishmentUpdateComponent', () => {
  let component: EstablishmentUpdateComponent;
  let fixture: ComponentFixture<EstablishmentUpdateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
