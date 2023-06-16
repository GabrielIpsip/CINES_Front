import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { BroadcastMainMenuComponent } from './broadcast-main-menu.component';

describe('BroadcastMainMenuComponent', () => {
  let component: BroadcastMainMenuComponent;
  let fixture: ComponentFixture<BroadcastMainMenuComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ BroadcastMainMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastMainMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
