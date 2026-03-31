import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AwardsCreate } from './awards-create';

describe('AwardsCreate', () => {
  let component: AwardsCreate;
  let fixture: ComponentFixture<AwardsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AwardsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AwardsCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
