import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorDocStructSearchListComponent } from './data-selector-doc-struct-search-list.component';

describe('BroadcastDocStructSearchListComponent', () => {
  let component: DataSelectorDocStructSearchListComponent;
  let fixture: ComponentFixture<DataSelectorDocStructSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorDocStructSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorDocStructSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
