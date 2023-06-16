import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { EstablishmentDocStructListComponent } from './establishment-doc-struct-list.component';

describe('EstablishmentDocStructListComponent', () => {
  let component: EstablishmentDocStructListComponent;
  let fixture: ComponentFixture<EstablishmentDocStructListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ EstablishmentDocStructListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EstablishmentDocStructListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
