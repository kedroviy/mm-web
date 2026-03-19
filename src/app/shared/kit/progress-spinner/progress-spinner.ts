import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {
  ProgresSpinnerDiameter,
  ProgressSpinnerSize,
  SPINNER_SIZE_MAP,
} from '@shared/kit/progress-spinner/progress-spinner.type';

@Component({
  selector: 'app-progress-spinner',
  imports: [MatProgressSpinnerModule],
  templateUrl: './progress-spinner.html',
  styleUrl: './progress-spinner.css',
  standalone: true,
})
export class ProgressSpinner {
  @Input() size: ProgressSpinnerSize = 'sm';
  @Input() mode: 'determinate' | 'indeterminate' = 'indeterminate';
  @Input() value: number = 0;

  get diameter(): ProgresSpinnerDiameter {
    return SPINNER_SIZE_MAP[this.size] || 12;
  }
}
