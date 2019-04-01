import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MomentumLoadingComponent } from './momentum-loading.component';

describe('MomentumLoadingComponent', () => {
  let component: MomentumLoadingComponent;
  let fixture: ComponentFixture<MomentumLoadingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MomentumLoadingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MomentumLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
