import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitTable } from './kit-table';

describe('KitTable', () => {
  let component: KitTable;
  let fixture: ComponentFixture<KitTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitTable],
    }).compileComponents();

    fixture = TestBed.createComponent(KitTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
