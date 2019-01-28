import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardChartComponent } from './leaderboard-chart.component';

describe('LeaderboardChartComponent', () => {
  let component: LeaderboardChartComponent;
  let fixture: ComponentFixture<LeaderboardChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderboardChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
