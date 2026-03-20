import { Component, Input } from '@angular/core';
import { ButtonIconPosition, ButtonSize, ButtonVariant } from './button.type';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BUTTON_TYPE } from './button-constants';
import { ProgressSpinner } from '@shared/kit/progress-spinner/progress-spinner';
import { COMMON_CONSTANTS } from '@core/constants';

@Component({
  selector: 'app-button',
  imports: [MatButtonModule, MatIconModule, ProgressSpinner],
  templateUrl: '/button.html',
  styleUrl: './button.css',
  standalone: true,
})
export class UiButtonComponent {
  @Input() variant: ButtonVariant = 'primary';
  @Input() size: ButtonSize = 'md';
  @Input() icon?: string;
  @Input() iconPosition: ButtonIconPosition = 'start';
  @Input() loading = false;
  @Input() text: string = COMMON_CONSTANTS.EMPTY_STRING;
  @Input() customColor?: string;
  @Input() isCircle = false;

  private variantToColorMap: Record<ButtonVariant, string> = BUTTON_TYPE;

  color = () => this.variantToColorMap[this.variant];

  get backgroundColor() {
    return this.customColor || this.variantToColorMap[this.variant];
  }

  sizeClass = () => {
    return {
      sm: 'btn-sm',
      md: 'btn-md',
      lg: 'btn-lg',
    }[this.size];
  };
}
