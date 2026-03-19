import { Component, inject } from '@angular/core';
import { KitGridComponent } from '@shared/kit/grid/kit-grid-component/kit-grid-component';
import { GridLayoutService } from '@core/services/layout/grid-layout.service.ts';

@Component({
  selector: 'app-home',
  imports: [KitGridComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {
  protected layout = inject(GridLayoutService);
  isAdmin = true;
}
