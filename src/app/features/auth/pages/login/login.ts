import { Component, inject, signal } from '@angular/core';
import { AuthService as CustomAuthService } from '@core/services/auth/auth.service';
import { Router } from '@angular/router';
import { UiButtonComponent } from '@shared/kit/button/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { KitInputComponent } from '@shared/kit/input/input';
import { COMMON_CONSTANTS } from '@core/index';
import { PageWrapper } from '@shared/kit/page-wrapper/page-wrapper';
import { NotificationsService } from '@core/services/notifications/notifications';
import { switchMap, tap } from 'rxjs';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrl: './login.css',
  standalone: true,
  imports: [UiButtonComponent, ReactiveFormsModule, KitInputComponent, PageWrapper, MatIcon],
})
export class AdminLogin {
  private authService = inject(CustomAuthService);
  private router = inject(Router);
  private notify = inject(NotificationsService);

  buttonText = signal('Войти');
  isLoading = signal(false);
  required = true;

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

    const email = this.form.value.login ?? COMMON_CONSTANTS.EMPTY_STRING;
    const password = this.form.value.password ?? COMMON_CONSTANTS.EMPTY_STRING;

    this.authService
      .login(email, password)
      .pipe(
        switchMap(() => this.authService.checkAuth()),
        tap(() => this.authService.clearCache()),
      )
      .subscribe({
        next: () => {
          this.notify.showSuccess(`Вход успешно осуществлён!`);
          this.authService.assignRandomAvatarHueForSession();

          void this.router.navigate(['/dashboard/home']);
        },
        error: (err) => {
          this.notify.showError(`Ошибка входа!`);
          this.isLoading.set(false);
          console.error(err);
          this.authService.logout().subscribe();
        },
      });
  }
}
