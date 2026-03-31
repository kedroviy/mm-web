import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgeRatingCreate } from './age-rating-create';

describe('AgeRatingCreate', () => {
  let component: AgeRatingCreate;
  let fixture: ComponentFixture<AgeRatingCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AgeRatingCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgeRatingCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
