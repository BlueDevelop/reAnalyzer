import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartBarDateComponent } from './chart-bar-date.component';

describe('ChartBarDateComponent', () => {
  let component: ChartBarDateComponent;
  let fixture: ComponentFixture<ChartBarDateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChartBarDateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChartBarDateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
