import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentRelationSearchListComponent } from './establishment-relation-search-list.component';

describe('EstablishmentRelationSearchListComponent', () => {
  let component: EstablishmentRelationSearchListComponent;
  let fixture: ComponentFixture<EstablishmentRelationSearchListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentRelationSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentRelationSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
