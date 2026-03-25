import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardLogsHub } from './dashboard-logs-hub';

describe('DashboardLogsHub', () => {
  let component: DashboardLogsHub;
  let fixture: ComponentFixture<DashboardLogsHub>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardLogsHub],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardLogsHub);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
