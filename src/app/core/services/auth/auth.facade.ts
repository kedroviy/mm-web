import { isPlatformServer } from '@angular/common';
import { HttpHeaders } from '@angular/common/http';
import {
  inject,
  Injectable,
  PLATFORM_ID,
  REQUEST,
  signal,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { catchError, map, Observable, of, tap } from 'rxjs';

// Orval
import { UsersService as GeneratedUserService } from '@core/api/generated/users/users.service';
import { AuthService as GeneratedAuthService } from '@core/api/generated/auth/auth.service';
import { UserProfileResponseDto } from '@core/api/model';

import { HeaderUser } from '@shared/kit/kit-header/kit-header.type';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private generatedAuth = inject(GeneratedAuthService);
  private generatedUsers = inject(GeneratedUserService);
  private request = inject(REQUEST, { optional: true }) as Request | null;

  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  // Единые сигналы для всего приложения
  readonly profile = signal<HeaderUser | null>(null);
  readonly authStatus = signal<boolean | null>(null);

  /**
   * Заменяет checkAuth и initAuth.
   * Вызывай этот метод в AppComponent ngOnInit.
   */
  checkAuth(): Observable<boolean> {
    if (this.transferState.hasKey(AUTH_KEY)) {
      const isAuth = this.transferState.get(AUTH_KEY, false);
      this.authStatus.set(isAuth);
      if (isAuth) this.initProfile();
      return of(isAuth);
    }

    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId) && this.request) {
      const cookieHeader = this.request.headers.get('cookie');
      if (cookieHeader) headers = headers.set('Cookie', cookieHeader);
    }

    return this.generatedUsers.usersControllerGetProfile<UserProfileResponseDto>({ headers }).pipe(
      tap((userProfile) => {
        this.updateState(userProfile);
        this.transferState.set(AUTH_KEY, true);
      }),
      map(() => true),
      catchError(() => {
        this.clearState();
        this.transferState.set(AUTH_KEY, false);
        return of(false);
      }),
    );
  }

  /**
   * Просто загрузка профиля (например, при обновлении страницы)
   */
  initProfile() {
    this.generatedUsers.usersControllerGetProfile<UserProfileResponseDto>().subscribe({
      next: (user) => this.updateState(user),
      error: () => this.clearState(),
    });
  }

  logout() {
    this.generatedAuth.authControllerLogout().subscribe({
      next: () => this.clearState(),
      error: () => this.clearState(), // Чистим даже при ошибке сети
    });
  }

  private updateState(user: UserProfileResponseDto) {
    this.profile.set(user as HeaderUser);
    this.authStatus.set(true);
  }

  private clearState() {
    this.profile.set(null);
    this.authStatus.set(false);
    this.transferState.remove(AUTH_KEY);
  }
}
