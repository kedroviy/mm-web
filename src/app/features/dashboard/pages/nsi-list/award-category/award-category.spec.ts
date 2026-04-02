import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardCategory } from './award-category';

describe('AwardCategory', () => {
  let component: AwardCategory;
  let fixture: ComponentFixture<AwardCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardCategory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
