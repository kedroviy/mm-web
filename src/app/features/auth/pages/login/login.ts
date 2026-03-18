import { Component, inject, Input, signal } from '@angular/core';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@shared/kit/button/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KitInputComponent } from '@shared/kit/input/input';
import { COMMON_CONSTANTS } from '@core/index';
import { PageWrapper } from '@shared/kit/page-wrapper/page-wrapper';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [UiButtonComponent, ReactiveFormsModule, KitInputComponent, PageWrapper],
})
export class Login {
  private auth = inject(AuthService);
  private router = inject(Router);
  buttonText = signal('Login');
  required: boolean = true;

  form = new FormGroup({
    login: new FormControl(COMMON_CONSTANTS.EMPTY_STRING, [Validators.required, Validators.email]),
    password: new FormControl(COMMON_CONSTANTS.EMPTY_STRING, Validators.required),
  });

  onSubmit() {
    if (this.form.invalid) return;

    const payload = {
      login: this.form.value.login ?? COMMON_CONSTANTS.EMPTY_STRING,
      password: this.form.value.password ?? COMMON_CONSTANTS.EMPTY_STRING,
    };

    this.auth.login(payload).subscribe({
      next: () => this.router.navigate(['/']),
      error: (err) => console.error('Login failed', err),
    });
  }
}
