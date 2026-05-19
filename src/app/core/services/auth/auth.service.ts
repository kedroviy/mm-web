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
import { catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { GetMeType } from '@core/api/model';
import { UserService as GeneratedUserService } from '@core/api/generated/user/user.service';
import { AuthService as GeneratedAuthService } from '@core/api/generated/auth/auth.service';
import { CookieService } from '@core/services/cookie/cookie.service';
import {
  AVATAR_SESSION_HUE_KEY,
  parseStoredHue,
  pickRandomAvatarHue,
  stableHueFromSeed,
} from '@core/utils/avatar-session-hue';
import {
  ACCESS_TOKEN_COOKIE,
  AUTH_EMAIL_STORAGE_KEY,
  AUTH_TOKEN_STORAGE_KEY,
  USER_EMAIL_COOKIE,
} from './auth.constants';

const AUTH_KEY = makeStateKey<boolean>('auth_state');
const AUTH_COOKIE_MAX_DAYS = 7;

@Injectable({ providedIn: 'root' })
export class AuthService {
  private platformId = inject(PLATFORM_ID);
  private usersApi = inject(GeneratedUserService);
  private cookies = inject(CookieService);
  private request = inject(REQUEST, { optional: true });
  private transferState = inject(TransferState);
  private readonly api = inject(GeneratedAuthService);

  readonly authStatus = signal<boolean | null>(null);
  readonly profile = signal<GetMeType | undefined>(undefined);
  readonly avatarHue = signal<number | null>(null);
  hasAuthenticated = signal<boolean | null>(null);

  initAuth(): Observable<void> {
    if (!this.getAccessToken()) {
      return of(undefined);
    }

    return this.fetchProfile().pipe(
      tap(() => this.hasAuthenticated.set(true)),
      map(() => undefined),
      shareReplay(1),
      catchError((err) => {
        this.clearSession();
        return throwError(() => err);
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

    if (!this.getAccessToken()) {
      this.clearSessionState();
      this.transferState.set(AUTH_KEY, false);
      return of(false);
    }

    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId) && this.request) {
      const cookieHeader = this.request.headers.get('cookie');
      if (cookieHeader) {
        headers = headers.set('Cookie', cookieHeader);
      }
    }

    return this.fetchProfile({ headers }).pipe(
      tap((userData) => {
        this.profile.set(userData);
        this.syncAvatarHueAfterProfileLoad(userData);
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
    return this.api.authControllerLogin({ email, password }).pipe(
      tap(({ token }) => {
        this.setAccessToken(token);
        this.setSessionEmail(email);
      }),
      map(() => undefined),
    );
  }

  logout(): Observable<void> {
    this.clearSession();
    return of(undefined);
  }

  getAccessToken(): string | null {
    const fromStorage = isPlatformBrowser(this.platformId)
      ? localStorage.getItem(AUTH_TOKEN_STORAGE_KEY)
      : null;
    const fromCookie = this.cookies.get(ACCESS_TOKEN_COOKIE);

    const token = fromStorage ?? fromCookie;

    if (token && isPlatformBrowser(this.platformId) && !fromStorage && fromCookie) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }

    return token;
  }

  getSessionEmail(): string | null {
    const fromStorage = isPlatformBrowser(this.platformId)
      ? localStorage.getItem(AUTH_EMAIL_STORAGE_KEY)
      : null;
    const fromCookie = this.cookies.get(USER_EMAIL_COOKIE);

    const email = fromStorage ?? fromCookie;

    if (email && isPlatformBrowser(this.platformId) && !fromStorage && fromCookie) {
      localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email);
    }

    return email;
  }

  setAccessToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_TOKEN_STORAGE_KEY, token);
    }
    this.cookies.set(ACCESS_TOKEN_COOKIE, token, { days: AUTH_COOKIE_MAX_DAYS });
  }

  setSessionEmail(email: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(AUTH_EMAIL_STORAGE_KEY, email);
    }
    this.cookies.set(USER_EMAIL_COOKIE, email, { days: AUTH_COOKIE_MAX_DAYS });
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

  private fetchProfile(options?: { headers?: HttpHeaders }): Observable<GetMeType> {
    const email = this.getSessionEmail();
    if (!email) {
      return throwError(() => new Error('User email is not available for profile request'));
    }

    return this.usersApi.userControllerGetMe({ userEmail: email }, options);
  }

  private clearSession(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(AUTH_TOKEN_STORAGE_KEY);
      localStorage.removeItem(AUTH_EMAIL_STORAGE_KEY);
    }
    this.cookies.remove(ACCESS_TOKEN_COOKIE);
    this.cookies.remove(USER_EMAIL_COOKIE);
    this.clearSessionState();
  }

  private clearSessionState(): void {
    this.profile.set(undefined);
    this.clearAvatarHue();
    this.authStatus.set(false);
    this.hasAuthenticated.set(false);
  }

  private syncAvatarHueAfterProfileLoad(user: GetMeType): void {
    const seed = String(user.id);

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
