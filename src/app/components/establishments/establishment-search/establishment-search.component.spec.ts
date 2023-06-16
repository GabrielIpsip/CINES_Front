import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentSearchComponent } from './establishment-search.component';

describe('EstablishmentSearchComponent', () => {
  let component: EstablishmentSearchComponent;
  let fixture: ComponentFixture<EstablishmentSearchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
