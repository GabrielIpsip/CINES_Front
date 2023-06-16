import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorTypesTreeComponent } from './data-selector-types-tree.component';

describe('DataSelectorTypesTreeComponent', () => {
  let component: DataSelectorTypesTreeComponent;
  let fixture: ComponentFixture<DataSelectorTypesTreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorTypesTreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorTypesTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
