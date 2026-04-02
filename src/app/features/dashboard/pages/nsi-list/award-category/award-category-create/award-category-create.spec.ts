import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardCategoryCreate } from './award-category-create';

describe('AwardCategoryCreate', () => {
  let component: AwardCategoryCreate;
  let fixture: ComponentFixture<AwardCategoryCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardCategoryCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardCategoryCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
