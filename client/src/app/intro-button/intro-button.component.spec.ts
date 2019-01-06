import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntroButtonComponent } from './intro-button.component';

describe('IntroButtonComponent', () => {
  let component: IntroButtonComponent;
  let fixture: ComponentFixture<IntroButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntroButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntroButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
