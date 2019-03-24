import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridMaterialDatepickerComponent } from './ag-grid-material-datepicker.component';

describe('AgGridMaterialDatepickerComponent', () => {
  let component: AgGridMaterialDatepickerComponent;
  let fixture: ComponentFixture<AgGridMaterialDatepickerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgGridMaterialDatepickerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridMaterialDatepickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
