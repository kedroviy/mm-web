import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardHubSection } from './dashboard-hub-section';

describe('DashboardHubSection', () => {
  let component: DashboardHubSection;
  let fixture: ComponentFixture<DashboardHubSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardHubSection],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardHubSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
