import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitHeader } from './kit-header';

describe('KitHeader', () => {
  let component: KitHeader;
  let fixture: ComponentFixture<KitHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(KitHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
