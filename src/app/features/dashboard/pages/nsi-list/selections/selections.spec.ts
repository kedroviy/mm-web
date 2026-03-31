import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Selections } from './selections';

describe('Selections', () => {
  let component: Selections;
  let fixture: ComponentFixture<Selections>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Selections]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Selections);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
