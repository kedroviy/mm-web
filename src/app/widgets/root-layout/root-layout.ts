import { Component, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

import { KitHeader } from '@shared/kit/kit-header';
import { MatIconModule } from '@angular/material/icon';
import { NavigationService } from '@core/services/layout/navigation.service';
import { UiButtonComponent } from '@shared/kit/button/button';

@Component({
  selector: 'app-root-layout',
  imports: [KitHeader, MatIconModule, RouterLink, RouterOutlet, UiButtonComponent],
  templateUrl: './root-layout.html',
  styleUrl: './root-layout.css',
  standalone: true,
})
export class RootLayout {
  protected readonly navService = inject(NavigationService);
}
