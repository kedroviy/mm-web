import { Component } from '@angular/core';
import { GridConfig } from '@shared/kit/grid/kit-grid-component/kit-grid-component.type';
import { KitGridComponent } from '@shared/kit/grid/kit-grid-component/kit-grid-component';
import { MY_DASHBOARD_CONFIG } from './lib/constants/constants';

@Component({
  selector: 'app-home',
  imports: [KitGridComponent],
  templateUrl: './home.html',
  styleUrl: './home.css',
  standalone: true,
})
export class Home {
  readonly config = MY_DASHBOARD_CONFIG;
}
