import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentCreateComponent } from './establishment-create.component';

describe('EstablishmentCreateComponent', () => {
  let component: EstablishmentCreateComponent;
  let fixture: ComponentFixture<EstablishmentCreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
