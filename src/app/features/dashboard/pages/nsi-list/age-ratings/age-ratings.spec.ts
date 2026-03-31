import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRatings } from './age-ratings';

describe('AgeRatings', () => {
  let component: AgeRatings;
  let fixture: ComponentFixture<AgeRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeRatings]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeRatings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
