import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorSearchListComponent } from './data-selector-search-list.component';

describe('BroadcastSearchListComponent', () => {
  let component: DataSelectorSearchListComponent;
  let fixture: ComponentFixture<DataSelectorSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
