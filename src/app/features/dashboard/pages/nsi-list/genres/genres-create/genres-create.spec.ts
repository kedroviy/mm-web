import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresCreate } from './genres-create';

describe('GenresCreate', () => {
  let component: GenresCreate;
  let fixture: ComponentFixture<GenresCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenresCreate],
    }).compileComponents();

    fixture = TestBed.createComponent(GenresCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
