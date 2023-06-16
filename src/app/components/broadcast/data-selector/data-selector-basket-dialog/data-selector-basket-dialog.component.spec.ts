import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorBasketDialogComponent } from './data-selector-basket-dialog.component';

describe('DataSelectorBasketDialogComponent', () => {
  let component: DataSelectorBasketDialogComponent;
  let fixture: ComponentFixture<DataSelectorBasketDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorBasketDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorBasketDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
