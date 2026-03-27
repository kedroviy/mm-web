import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenresView } from './genres-view';

describe('GenresView', () => {
  let component: GenresView;
  let fixture: ComponentFixture<GenresView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GenresView],
    }).compileComponents();

    fixture = TestBed.createComponent(GenresView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
