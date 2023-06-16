import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LogginComponent } from './loggin.component';

describe('LogginComponent', () => {
  let component: LogginComponent;
  let fixture: ComponentFixture<LogginComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LogginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
