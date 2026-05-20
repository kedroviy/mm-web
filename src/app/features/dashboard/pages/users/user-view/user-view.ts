import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { NsiUsersService } from '@core/api/generated/nsi-users/nsi-users.service';
import { ClientType } from '@core/api/model';
import { NotificationsService } from '@core/services/notifications/notifications';
import { UsersStore } from '@features/dashboard/pages/users/users.store';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-user-view',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    RouterLink,
  ],
  templateUrl: './user-view.html',
  styleUrl: './user-view.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
})
export class UserView implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly api = inject(NsiUsersService);
  private readonly notify = inject(NotificationsService);
  private readonly usersStore = inject(UsersStore);
  private readonly fb = inject(NonNullableFormBuilder);

  readonly loading = signal(false);
  readonly saving = signal(false);
  readonly clientTypes = [ClientType.NONE, ClientType.GOOGLE] as const;

  readonly form = this.fb.group({
    username: this.fb.control('', { validators: [Validators.required, Validators.minLength(1)] }),
    email: this.fb.control('', { validators: [Validators.required, Validators.email] }),
    client: this.fb.control<ClientType>(ClientType.NONE, { validators: [Validators.required] }),
    password: this.fb.control(''),
  });

  private userId: number | null = null;

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = idParam ? Number(idParam) : NaN;
    if (!Number.isFinite(id)) {
      void this.router.navigate(['/dashboard/users']);
      return;
    }
    this.userId = id;
    this.loadUser(id);
  }

  save(): void {
    if (this.form.invalid || this.userId === null) {
      this.form.markAllAsTouched();
      return;
    }
    const password = this.form.controls.password.value.trim();
    this.saving.set(true);
    this.api
      .usersNsiControllerUpdateUser(this.userId, {
        username: this.form.controls.username.value.trim(),
        email: this.form.controls.email.value.trim(),
        client: this.form.controls.client.value,
        ...(password.length > 0 ? { password } : {}),
      })
      .pipe(
        catchError(() => {
          this.notify.showError('Не удалось сохранить изменения');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.notify.showSuccess('Сохранено');
        this.form.controls.password.setValue('');
        this.patchForm(res);
      });
  }

  deleteUser(): void {
    if (this.userId === null) {
      return;
    }
    if (!window.confirm('Удалить пользователя? Это действие необратимо.')) {
      return;
    }
    this.saving.set(true);
    this.api
      .usersNsiControllerDeleteUser(this.userId, { observe: 'response' })
      .pipe(
        catchError(() => {
          this.notify.showError('Не удалось удалить пользователя');
          return of(null);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe((res) => {
        if (!res) {
          return;
        }
        this.usersStore.invalidate();
        this.notify.showSuccess('Пользователь удалён');
        void this.router.navigate(['/dashboard/users']);
      });
  }

  private loadUser(id: number): void {
    this.loading.set(true);
    this.api
      .usersNsiControllerGetUserById(id)
      .pipe(
        catchError(() => {
          this.notify.showError('Пользователь не найден');
          void this.router.navigate(['/dashboard/users']);
          return of(null);
        }),
        finalize(() => this.loading.set(false)),
      )
      .subscribe((user) => {
        if (user) {
          this.patchForm(user);
        }
      });
  }

  private patchForm(user: { username: string; email: string; client: ClientType }): void {
    this.form.patchValue({
      username: user.username,
      email: user.email,
      client: user.client,
      password: '',
    });
  }
}
