import { Component, inject, Input } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { ControlContainer, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HideEmptyErrorDirective } from '@core/directives/hide-empty-error';
import { COMMON_CONSTANTS } from '@core/constants';

@Component({
  selector: 'app-input',
  imports: [MatInputModule, ReactiveFormsModule, HideEmptyErrorDirective],
  templateUrl: '/input.html',
  styleUrl: '/input.css',
  standalone: true,
  viewProviders: [
    {
      provide: ControlContainer,
      useFactory: () => inject(ControlContainer, { skipSelf: true, optional: true }),
    },
  ],
})
export class KitInputComponent {
  @Input() controlName?: string;
  @Input() inputFormControl!: FormControl;
  @Input() label?: string;
  @Input() placeholder?: string;
  @Input() type = 'text';
  @Input() errors: Record<string, string> = {};
  @Input() errorStateMatcher: ErrorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  @Input() appearance: 'outline' | 'fill' = 'outline';
  @Input() disabled = false;
  @Input() required = false;
  @Input() value?: string;

  private static readonly DEFAULT_ERRORS: Record<string, string> = {
    required: 'Обязательное поле',
    minlength: 'Слишком короткое значение',
    maxlength: 'Слишком длинное значение',
    pattern: 'Неверный формат',
    email: 'Неверный email',
    min: 'Значение слишком мало',
    max: 'Значение слишком велико',
  };

  readonly constants = { ...COMMON_CONSTANTS };
  private parentContainer = inject(ControlContainer, { optional: true });

  get control(): FormControl {
    if (this.inputFormControl) return this.inputFormControl;

    const formGroup = this.parentContainer?.control as FormGroup;

    if (formGroup && this.controlName) {
      const ctrl = formGroup.get(this.controlName);
      if (ctrl) return ctrl as FormControl;
    }

    return new FormControl();
  }

  get errorMessage(): string {
    const controlErrors = this.control.errors;
    if (!controlErrors) return '';

    const errorKey = Object.keys(controlErrors)[0];
    return this.errors[errorKey]
      ?? KitInputComponent.DEFAULT_ERRORS[errorKey]
      ?? 'Ошибка ввода';
  }

  protected readonly COMMON_CONSTANTS = COMMON_CONSTANTS;
}
