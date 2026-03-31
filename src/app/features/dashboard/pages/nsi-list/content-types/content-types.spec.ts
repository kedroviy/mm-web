import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypes } from './content-types';

describe('ContentTypes', () => {
  let component: ContentTypes;
  let fixture: ComponentFixture<ContentTypes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTypes]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentTypes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
