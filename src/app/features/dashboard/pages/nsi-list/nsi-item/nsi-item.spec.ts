import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiItem } from './nsi-item';

describe('NsiItem', () => {
  let component: NsiItem;
  let fixture: ComponentFixture<NsiItem>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NsiItem],
    }).compileComponents();

    fixture = TestBed.createComponent(NsiItem);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
