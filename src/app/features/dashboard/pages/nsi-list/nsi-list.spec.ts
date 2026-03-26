import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NsiList } from './nsi-list';

describe('NsiList', () => {
  let component: NsiList;
  let fixture: ComponentFixture<NsiList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NsiList],
    }).compileComponents();

    fixture = TestBed.createComponent(NsiList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
