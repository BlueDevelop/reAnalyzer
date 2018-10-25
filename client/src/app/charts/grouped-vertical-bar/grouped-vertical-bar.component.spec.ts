import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupedVerticalBarComponent } from './grouped-vertical-bar.component';

describe('GroupedVerticalBarComponent', () => {
  let component: GroupedVerticalBarComponent;
  let fixture: ComponentFixture<GroupedVerticalBarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GroupedVerticalBarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GroupedVerticalBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
