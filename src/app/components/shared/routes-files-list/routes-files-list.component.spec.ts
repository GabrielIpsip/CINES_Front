import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RoutesFilesListComponent } from './routes-files-list.component';

describe('RoutesFilesListComponent', () => {
  let component: RoutesFilesListComponent;
  let fixture: ComponentFixture<RoutesFilesListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RoutesFilesListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RoutesFilesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
