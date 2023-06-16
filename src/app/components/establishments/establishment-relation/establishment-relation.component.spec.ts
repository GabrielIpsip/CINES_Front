import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentRelationComponent } from './establishment-relation.component';

describe('EstablishmentRelationComponent', () => {
  let component: EstablishmentRelationComponent;
  let fixture: ComponentFixture<EstablishmentRelationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentRelationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentRelationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
