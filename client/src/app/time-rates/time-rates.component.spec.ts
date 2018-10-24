import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TimeRatesComponent } from './time-rates.component';

describe('TimeRatesComponent', () => {
  let component: TimeRatesComponent;
  let fixture: ComponentFixture<TimeRatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TimeRatesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TimeRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
