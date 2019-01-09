import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PdfButtonComponent } from './pdf-button.component';

describe('PdfButtonComponent', () => {
  let component: PdfButtonComponent;
  let fixture: ComponentFixture<PdfButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PdfButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PdfButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
