import { Component, inject, Input, signal } from '@angular/core';
import { AuthService } from '@core/api/generated/auth/auth.service';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@shared/kit/button/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KitInputComponent } from '@shared/kit/input/input';
import { COMMON_CONSTANTS } from '@core/index';
import { PageWrapper } from '@shared/kit/page-wrapper/page-wrapper';
import { AdminLoginDto } from '@core/api/model';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [UiButtonComponent, ReactiveFormsModule, KitInputComponent, PageWrapper],
})
export class AdminLogin {
  private auth = inject(AuthService);
  private router = inject(Router);
  buttonText = signal('Login');
  required: boolean = true;

  form = new FormGroup({
    login: new FormControl(COMMON_CONSTANTS.EMPTY_STRING, [Validators.required, Validators.email]),
    password: new FormControl(COMMON_CONSTANTS.EMPTY_STRING, Validators.required),
  });

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload: AdminLoginDto = {
      email: this.form.value.login ?? COMMON_CONSTANTS.EMPTY_STRING,
      password: this.form.value.password ?? COMMON_CONSTANTS.EMPTY_STRING,
    };

    this.buttonText.set('Logging in...');

    this.auth.authControllerAdminLogin(payload).subscribe({
      next: (response) => {
        console.log('Success:', response);
        this.router.navigate(['/dashboard/home']);
      },
      error: (err) => {
        this.buttonText.set('Login');
        console.error('Login failed', err);
      },
    });
  }
}
