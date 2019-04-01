import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridStatusChipComponent } from './ag-grid-status-chip.component';

describe('AgGridStatusChipComponent', () => {
  let component: AgGridStatusChipComponent;
  let fixture: ComponentFixture<AgGridStatusChipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridStatusChipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridStatusChipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
