import { TestBed } from '@angular/core/testing';

import { GridLayoutServiceTs } from './grid-layout.service.ts';

describe('GridLayoutServiceTs', () => {
  let service: GridLayoutServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GridLayoutServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
