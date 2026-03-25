import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitCard } from './kit-card';

describe('KitCard', () => {
  let component: KitCard;
  let fixture: ComponentFixture<KitCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitCard],
    }).compileComponents();

    fixture = TestBed.createComponent(KitCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
