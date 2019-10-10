import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyGivenTaskComponent } from './my-given-task.component';

describe('MyGivenTaskComponent', () => {
  let component: MyGivenTaskComponent;
  let fixture: ComponentFixture<MyGivenTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyGivenTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyGivenTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
