import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentConsultComponent } from './establishment-consult.component';

describe('EstablishmentConsultComponent', () => {
  let component: EstablishmentConsultComponent;
  let fixture: ComponentFixture<EstablishmentConsultComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentConsultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentConsultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
