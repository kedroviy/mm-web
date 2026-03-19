import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitGridComponent } from './kit-grid-component';

describe('KitGridComponent', () => {
  let component: KitGridComponent;
  let fixture: ComponentFixture<KitGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitGridComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(KitGridComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
