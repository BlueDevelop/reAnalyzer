import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PieStatusComponent } from './pie-status.component';

describe('PieStatusComponent', () => {
  let component: PieStatusComponent;
  let fixture: ComponentFixture<PieStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PieStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PieStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
