import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatCardAppearance, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { COMMON_CONSTANTS } from '@core/constants';

@Component({
  selector: 'app-kit-card',
  imports: [MatCardModule, MatButtonModule],
  templateUrl: './kit-card.html',
  styleUrl: './kit-card.css',
  standalone: true,
})
export class KitCard {
  @Input() appearance: MatCardAppearance = 'outlined';
  @Input() align: 'start' | 'end' = 'start';
  @Input() title: string = COMMON_CONSTANTS.EMPTY_STRING;
  @Input() description: string = COMMON_CONSTANTS.EMPTY_STRING;
  @Input() actionText: string = COMMON_CONSTANTS.EMPTY_STRING;

  @Output() actionClick = new EventEmitter<void>();
}
