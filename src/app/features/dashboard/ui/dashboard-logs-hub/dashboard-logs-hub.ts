import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { KitCard } from '@shared/kit/kit-card/kit-card';
import { Router } from '@angular/router';
import { LOGS_MODULES } from 'src/app/features/dashboard/lib/constants/constants';

@Component({
  selector: 'app-dashboard-logs-hub',
  imports: [KitCard],
  templateUrl: './dashboard-logs-hub.html',
  styleUrl: './dashboard-logs-hub.css',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardLogsHub {
  private router = inject(Router);
  modules = LOGS_MODULES;
  title = input<string>('Модули');

  navigate(path: string) {
    void this.router.navigate([path]);
  }
}
