import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitInputComponent } from './input';

describe('Input', () => {
  let component: KitInputComponent;
  let fixture: ComponentFixture<KitInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitInputComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KitInputComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
