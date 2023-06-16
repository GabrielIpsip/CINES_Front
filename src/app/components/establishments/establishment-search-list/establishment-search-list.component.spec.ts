import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentSearchListComponent } from './establishment-search-list.component';

describe('EstablishmentSearchListComponent', () => {
  let component: EstablishmentSearchListComponent;
  let fixture: ComponentFixture<EstablishmentSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
