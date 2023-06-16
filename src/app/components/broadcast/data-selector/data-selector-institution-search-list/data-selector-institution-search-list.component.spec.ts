import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSelectorInstitutionSearchListComponent } from './data-selector-institution-search-list.component';

describe('BroadcastInstitutionSearchListComponent', () => {
  let component: DataSelectorInstitutionSearchListComponent;
  let fixture: ComponentFixture<DataSelectorInstitutionSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSelectorInstitutionSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSelectorInstitutionSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
