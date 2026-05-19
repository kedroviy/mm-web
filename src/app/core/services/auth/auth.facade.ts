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

import { UserService as GeneratedUserService } from '@core/api/generated/user/user.service';
import { GetMeType } from '@core/api/model';

import { HeaderUser } from '@shared/kit/kit-header/kit-header.type';
import { AuthService } from './auth.service';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthFacade {
  private authService = inject(AuthService);
  private generatedUsers = inject(GeneratedUserService);
  private request = inject(REQUEST, { optional: true }) as Request | null;

  private platformId = inject(PLATFORM_ID);
  private transferState = inject(TransferState);

  readonly profile = signal<HeaderUser | null>(null);
  readonly authStatus = signal<boolean | null>(null);

  checkAuth(): Observable<boolean> {
    if (this.transferState.hasKey(AUTH_KEY)) {
      const isAuth = this.transferState.get(AUTH_KEY, false);
      this.authStatus.set(isAuth);
      if (isAuth) this.initProfile();
      return of(isAuth);
    }

    const email = this.authService.getSessionEmail();
    if (!email) {
      this.clearState();
      this.transferState.set(AUTH_KEY, false);
      return of(false);
    }

    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId) && this.request) {
      const cookieHeader = this.request.headers.get('cookie');
      if (cookieHeader) headers = headers.set('Cookie', cookieHeader);
    }

    return this.generatedUsers.userControllerGetMe({ userEmail: email }, { headers }).pipe(
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

  initProfile() {
    const email = this.authService.getSessionEmail();
    if (!email) {
      this.clearState();
      return;
    }

    this.generatedUsers.userControllerGetMe({ userEmail: email }).subscribe({
      next: (user) => this.updateState(user),
      error: () => this.clearState(),
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => this.clearState(),
      error: () => this.clearState(),
    });
  }

  private updateState(user: GetMeType) {
    this.profile.set(user);
    this.authStatus.set(true);
  }

  private clearState() {
    this.profile.set(null);
    this.authStatus.set(false);
    this.transferState.remove(AUTH_KEY);
  }
}
