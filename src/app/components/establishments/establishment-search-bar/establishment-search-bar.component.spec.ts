import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentSearchBarComponent } from './establishment-search-bar.component';

describe('EstablishmentSearchBarComponent', () => {
  let component: EstablishmentSearchBarComponent;
  let fixture: ComponentFixture<EstablishmentSearchBarComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentSearchBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
