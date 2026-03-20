import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitLabel } from './kit-label';

describe('KitLabel', () => {
  let component: KitLabel;
  let fixture: ComponentFixture<KitLabel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitLabel],
    }).compileComponents();

    fixture = TestBed.createComponent(KitLabel);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
