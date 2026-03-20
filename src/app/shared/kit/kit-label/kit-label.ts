import { Component, input } from '@angular/core';
import { LabelVariant } from '@shared/kit/kit-label/kit-label.type';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-kit-label',
  imports: [MatIconModule],
  templateUrl: './kit-label.html',
  styleUrl: './kit-label.css',
  standalone: true,
})
export class KitLabel {
  text = input.required<string>();
  icon = input<string>();
  svgPath = input<string>(); // Путь к файлу: 'assets/icons/my-icon.svg'
  variant = input<LabelVariant>('neutral');
}
