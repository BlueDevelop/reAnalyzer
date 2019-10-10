import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SecondaryDashboardComponent } from './secondary-dashboard.component';

describe('SecondaryDashboardComponent', () => {
  let component: SecondaryDashboardComponent;
  let fixture: ComponentFixture<SecondaryDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SecondaryDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SecondaryDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
