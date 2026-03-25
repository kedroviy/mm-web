import { Component, inject, input } from '@angular/core';
import { KitCard } from '@shared/kit/kit-card/kit-card';
import { Router } from '@angular/router';
import { MODULES } from 'src/app/features/dashboard/lib/constants/constants';

@Component({
  selector: 'app-dashboard-hub-section',
  imports: [KitCard],
  templateUrl: './dashboard-hub-section.html',
  styleUrl: './dashboard-hub-section.css',
  standalone: true,
})
export class DashboardHubSection {
  private router = inject(Router);
  modules = MODULES;
  title = input<string>('Заголовок по умолчанию');

  navigate(path: string) {
    void this.router.navigate([path]);
  }
}
