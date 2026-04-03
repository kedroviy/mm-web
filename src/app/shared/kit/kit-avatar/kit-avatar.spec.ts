import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KitAvatar } from './kit-avatar';

describe('KitAvatar', () => {
  let component: KitAvatar;
  let fixture: ComponentFixture<KitAvatar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KitAvatar]
    })
    .compileComponents();

    fixture = TestBed.createComponent(KitAvatar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
