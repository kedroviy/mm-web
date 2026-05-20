import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  REQUEST,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { catchError, map, Observable, of, shareReplay, tap } from 'rxjs';
import type { AdminMeDto } from '@core/api/model';
import { AdminAuthService as GeneratedAdminAuthService } from '@core/api/generated/admin-auth/admin-auth.service';
import {
  AVATAR_SESSION_HUE_KEY,
  parseStoredHue,
  pickRandomAvatarHue,
  stableHueFromSeed,
} from '@core/utils/avatar-session-hue';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private request = inject(REQUEST, { optional: true });
  private transferState = inject(TransferState);
  private readonly adminApi = inject(GeneratedAdminAuthService);

  readonly authStatus = signal<boolean | null>(null);
  readonly profile = signal<AdminMeDto | undefined>(undefined);
  readonly avatarHue = signal<number | null>(null);
  hasAuthenticated = signal<boolean | null>(null);

  initAuth(): Observable<void> {
    return this.fetchProfile(this.buildSsrHeaders()).pipe(
      tap((admin) => {
        if (!admin.isAdmin) {
          throw new Error('Admin access is not granted');
        }
        this.profile.set(admin);
        this.syncAvatarHueAfterProfileLoad(admin);
        this.authStatus.set(true);
        this.hasAuthenticated.set(true);
      }),
      map(() => undefined),
      shareReplay(1),
      catchError(() => {
        this.clearSessionState();
        return of(undefined);
      }),
    );
  }

  checkAuth(): Observable<boolean> {
    if (this.transferState.hasKey(AUTH_KEY)) {
      const isAuth = this.transferState.get(AUTH_KEY, false);
      this.transferState.remove(AUTH_KEY);
      this.authStatus.set(isAuth);
      return of(isAuth);
    }

    return this.fetchProfile(this.buildSsrHeaders()).pipe(
      tap((admin) => {
        if (!admin.isAdmin) {
          throw new Error('Admin access is not granted');
        }
        this.profile.set(admin);
        this.syncAvatarHueAfterProfileLoad(admin);
        this.authStatus.set(true);
        this.transferState.set(AUTH_KEY, true);
      }),
      map(() => true),
      catchError(() => {
        this.clearSessionState();
        this.transferState.set(AUTH_KEY, false);
        return of(false);
      }),
      shareReplay(1),
    );
  }

  isLoggedIn(): boolean {
    return this.authStatus() === true;
  }

  login(email: string, password: string): Observable<void> {
    return this.adminApi
      .adminAuthControllerLogin({ email, password }, { withCredentials: true })
      .pipe(map(() => undefined));
  }

  logout(): Observable<void> {
    return this.adminApi.adminAuthControllerLogout({ withCredentials: true }).pipe(
      tap(() => this.clearSessionState()),
      catchError(() => {
        this.clearSessionState();
        return of(undefined);
      }),
      map(() => undefined),
    );
  }

  clearCache(): void {
    // kept for login flow compatibility
  }

  assignRandomAvatarHueForSession(): void {
    const h = pickRandomAvatarHue();
    this.avatarHue.set(h);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(AVATAR_SESSION_HUE_KEY, String(h));
    }
  }

  private fetchProfile(headers?: HttpHeaders): Observable<AdminMeDto> {
    return this.adminApi.adminAuthControllerGetMe({
      headers,
      withCredentials: true,
    });
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

  private clearSessionState(): void {
    this.profile.set(undefined);
    this.clearAvatarHue();
    this.authStatus.set(false);
    this.hasAuthenticated.set(false);
  }

  private syncAvatarHueAfterProfileLoad(admin: AdminMeDto): void {
    const seed = String(admin.id);
    if (isPlatformBrowser(this.platformId)) {
      const stored = parseStoredHue(sessionStorage.getItem(AVATAR_SESSION_HUE_KEY));
      if (stored !== null) {
        this.avatarHue.set(stored);
        return;
      }
      if (this.avatarHue() !== null) {
        return;
      }
      const h = stableHueFromSeed(seed);
      this.avatarHue.set(h);
      sessionStorage.setItem(AVATAR_SESSION_HUE_KEY, String(h));
      return;
    }
    this.avatarHue.set(stableHueFromSeed(seed));
  }

  private clearAvatarHue(): void {
    this.avatarHue.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(AVATAR_SESSION_HUE_KEY);
    }
  }
}
