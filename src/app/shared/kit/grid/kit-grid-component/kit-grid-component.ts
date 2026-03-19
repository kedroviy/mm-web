import { Component, input } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { GridConfig } from '@shared/kit/grid/kit-grid-component/kit-grid-component.type';

@Component({
  selector: 'app-kit-grid-component',
  imports: [MatGridListModule],
  templateUrl: './kit-grid-component.html',
  styleUrl: './kit-grid-component.css',
  standalone: true,
})
export class KitGridComponent {
  readonly config = input.required<GridConfig>();
}
