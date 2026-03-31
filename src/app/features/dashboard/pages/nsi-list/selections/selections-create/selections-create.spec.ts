import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectionsCreate } from './selections-create';

describe('SelectionsCreate', () => {
  let component: SelectionsCreate;
  let fixture: ComponentFixture<SelectionsCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectionsCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SelectionsCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
