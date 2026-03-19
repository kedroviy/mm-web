import { Component, inject, signal } from '@angular/core';
import { AuthService } from '@core/api/generated/auth/auth.service';
import { AuthService as CustomAuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@shared/kit/button/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KitInputComponent } from '@shared/kit/input/input';
import { COMMON_CONSTANTS } from '@core/index';
import { PageWrapper } from '@shared/kit/page-wrapper/page-wrapper';
import { AdminLoginDto } from '@core/api/model';
import { NotificationsService } from '@core/services/notifications/notifications';
import { tap } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [UiButtonComponent, ReactiveFormsModule, KitInputComponent, PageWrapper],
})
export class AdminLogin {
  private auth = inject(AuthService);
  private customAuthService = inject(CustomAuthService);
  private router = inject(Router);
  private notify = inject(NotificationsService);
  buttonText = signal('Войти');
  isLoading = signal(false);
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

    this.isLoading.set(true);

    const payload: AdminLoginDto = {
      email: this.form.value.login ?? COMMON_CONSTANTS.EMPTY_STRING,
      password: this.form.value.password ?? COMMON_CONSTANTS.EMPTY_STRING,
    };

    this.auth
      .authControllerAdminLogin(payload)
      .pipe(
        tap(() => this.customAuthService.authStatus.set(true)),
        tap(() => this.customAuthService.clearCache()),
      )
      .subscribe({
        next: () => {
          this.notify.showSuccess(`Вход успешно осуществлён!`);

          this.router.navigate(['/dashboard/home']);
        },
        error: (err) => {
          this.notify.showError(`Ошибка входа!`);
          this.isLoading.set(false);
          this.customAuthService.authStatus.set(false); // На всякий случай сбрасываем
        },
      });
  }
}
