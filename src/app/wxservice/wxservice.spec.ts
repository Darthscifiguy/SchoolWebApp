import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Wxservice } from './wxservice';

describe('Wxservice', () => {
  let component: Wxservice;
  let fixture: ComponentFixture<Wxservice>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Wxservice]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Wxservice);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
