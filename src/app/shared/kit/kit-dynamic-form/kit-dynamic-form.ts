import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { FormFieldConfig, FORM_COMPONENT_REGISTRY } from '@shared/kit/kit-dynamic-form/form-factory.types';
import { UiButtonComponent } from '@shared/kit/button/button';
import { COMMON_CONSTANTS } from '@core/constants';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-kit-dynamic-form',
  imports: [ReactiveFormsModule, UiButtonComponent, NgComponentOutlet],
  templateUrl: './kit-dynamic-form.html',
  styleUrl: './kit-dynamic-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class KitDynamicForm implements OnInit {
  private fb = inject(FormBuilder);
  private registry = inject(FORM_COMPONENT_REGISTRY);

  config = input.required<FormFieldConfig[]>();
  loading = input(false);

  form: FormGroup = this.fb.group({});
  showFormError = signal(false);

  submitted = output<Record<string, unknown>>();
  cancelled = output<void>();

  ngOnInit() {
    this.fillForm();
  }

  private fillForm() {
    this.config().forEach((field) => {
      this.form.addControl(
        field.key,
        this.fb.control(
          field.initialValue ?? COMMON_CONSTANTS.EMPTY_STRING,
          field.validators ?? [],
        ),
      );
    });
  }

  getComponent(type: string) {
    return this.registry[type] || this.registry['text'];
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      this.showFormError.set(false);
      this.submitted.emit(this.form.value);
    } else {
      this.showFormError.set(true);
    }
  }
}
