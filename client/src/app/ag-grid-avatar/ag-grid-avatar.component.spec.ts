import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridAvatarComponent } from './ag-grid-avatar.component';

describe('AgGridAvatarComponent', () => {
  let component: AgGridAvatarComponent;
  let fixture: ComponentFixture<AgGridAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
