import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BroadcastPhysicLibSearchListComponent } from './data-selector-physic-lib-search-list.component';

describe('BroadcastPhysicLibSearchListComponent', () => {
  let component: BroadcastPhysicLibSearchListComponent;
  let fixture: ComponentFixture<BroadcastPhysicLibSearchListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BroadcastPhysicLibSearchListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastPhysicLibSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
