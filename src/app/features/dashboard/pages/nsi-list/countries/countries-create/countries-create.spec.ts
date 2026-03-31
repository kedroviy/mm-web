import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountriesCreate } from './countries-create';

describe('CountriesCreate', () => {
  let component: CountriesCreate;
  let fixture: ComponentFixture<CountriesCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CountriesCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountriesCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
