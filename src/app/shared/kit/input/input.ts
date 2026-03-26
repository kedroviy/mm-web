import { Component, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-input',
  imports: [MatInputModule, ReactiveFormsModule],
  templateUrl: '/input.html',
  styleUrl: '/input.css',
  standalone: true,
})
export class KitInputComponent {
  @Input() inputFormControl!: FormControl;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() disabled!: boolean;
  @Input() required!: boolean;
  @Input() errorStateMatcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() value?: string;
}
