import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
  signal,
} from '@angular/core';
import { MatCardAppearance, MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { COMMON_CONSTANTS } from '@core/constants';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-kit-card',
  imports: [MatCardModule, MatButtonModule, MatIcon],
  templateUrl: './kit-card.html',
  styleUrl: './kit-card.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitCard {
  @Input() appearance: MatCardAppearance = 'outlined';
  @Input() align: 'start' | 'end' = 'start';
  @Input() title: string = COMMON_CONSTANTS.EMPTY_STRING;
  @Input() description: string = COMMON_CONSTANTS.EMPTY_STRING;
  @Input() actionText: string = COMMON_CONSTANTS.EMPTY_STRING;

  @Output() actionClick = new EventEmitter<void>();

  protected accentX = signal(50);

  protected onCardPointerMove(event: PointerEvent): void {
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const pct = ((event.clientX - rect.left) / rect.width) * 100;
    this.accentX.set(Math.max(0, Math.min(100, pct)));
  }

  protected onCardPointerLeave(): void {
    this.accentX.set(50);
  }
}
