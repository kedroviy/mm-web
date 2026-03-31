import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContentTypeCreate } from './content-type-create';

describe('ContentTypeCreate', () => {
  let component: ContentTypeCreate;
  let fixture: ComponentFixture<ContentTypeCreate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContentTypeCreate]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ContentTypeCreate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
