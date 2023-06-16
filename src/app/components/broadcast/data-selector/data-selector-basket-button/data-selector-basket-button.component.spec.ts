import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorBasketButtonComponent } from './data-selector-basket-button.component';

describe('DataSelectorBasketButtonComponent', () => {
  let component: DataSelectorBasketButtonComponent;
  let fixture: ComponentFixture<DataSelectorBasketButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorBasketButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorBasketButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
