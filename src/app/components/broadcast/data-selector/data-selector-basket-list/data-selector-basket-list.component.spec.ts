import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorBasketListComponent } from './data-selector-basket-list.component';

describe('DataSelectorBasketListComponent', () => {
  let component: DataSelectorBasketListComponent;
  let fixture: ComponentFixture<DataSelectorBasketListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorBasketListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorBasketListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
