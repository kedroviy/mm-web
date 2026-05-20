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

import { AdminMeDto } from '@core/api/admin-auth/model';
import { AdminAuthService as GeneratedAdminAuthService } from '@core/api/admin-auth/generated/admin-auth/admin-auth.service';
import { HeaderUser } from '@shared/kit/kit-header/kit-header.type';
import { AuthService } from './auth.service';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authService = inject(AuthService);
  private adminApi = inject(GeneratedAdminAuthService);
  private request = inject(REQUEST, { optional: true }) as Request | null;
  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  readonly profile = signal<HeaderUser | null>(null);
  readonly authStatus = signal<boolean | null>(null);

  checkAuth(): Observable<boolean> {
    if (this.transferState.hasKey(AUTH_KEY)) {
      const isAuth = this.transferState.get(AUTH_KEY, false);
      this.authStatus.set(isAuth);
      if (isAuth) {
        this.initProfile();
      }
      return of(isAuth);
    }
    return this.adminApi
      .adminAuthControllerGetMe({
        headers: this.buildSsrHeaders(),
        withCredentials: true,
      })
      .pipe(
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

  initProfile(): void {
    this.adminApi
      .adminAuthControllerGetMe({ withCredentials: true })
      .subscribe({
        next: (user) => this.updateState(user),
        error: () => this.clearState(),
      });
  }

  logout(): void {
    this.authService.logout().subscribe({
      next: () => this.clearState(),
      error: () => this.clearState(),
    });
  }

  private updateState(user: AdminMeDto): void {
    this.profile.set(user);
    this.authStatus.set(true);
  }

  private clearState(): void {
    this.profile.set(null);
    this.authStatus.set(false);
    this.transferState.remove(AUTH_KEY);
  }

  private buildSsrHeaders(): HttpHeaders | undefined {
    if (!isPlatformServer(this.platformId) || !this.request) {
      return undefined;
    }
    const cookieHeader = this.request.headers.get('cookie');
    if (!cookieHeader) {
      return undefined;
    }
    return new HttpHeaders().set('Cookie', cookieHeader);
  }
}
