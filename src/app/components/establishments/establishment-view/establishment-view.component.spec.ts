import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentViewComponent } from './establishment-view.component';

describe('EstablishmentViewComponent', () => {
  let component: EstablishmentViewComponent;
  let fixture: ComponentFixture<EstablishmentViewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
