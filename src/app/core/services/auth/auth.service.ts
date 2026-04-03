import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  REQUEST,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { CookieService } from '@core/services/cookie/cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { UserProfileResponseDto } from '@core/api/model';
import { UsersService as GeneratedUserService } from '@core/api/generated/users/users.service';
import { AuthService as GeneratedAuthService } from '@core/api/generated/auth/auth.service';
import {
  AVATAR_SESSION_HUE_KEY,
  parseStoredHue,
  pickRandomAvatarHue,
  stableHueFromSeed,
} from '@core/utils/avatar-session-hue';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookies = inject(CookieService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private usersApi = inject(GeneratedUserService);
  private request = inject(REQUEST, { optional: true });
  private transferState = inject(TransferState);
  private readonly api = inject(GeneratedAuthService);

  private authState$?: Observable<boolean>;

  readonly authStatus = signal<boolean | null>(null);
  readonly profile = signal<UserProfileResponseDto | undefined>(undefined);
  /** Оттенок фона аватара (HSL 0–359); при логине назначается случайный. */
  readonly avatarHue = signal<number | null>(null);
  hasAuthenticated = signal<boolean | null>(null);

  private readonly ACCESS_TOKEN_COOKIE = 'access_token';
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token';

  initAuth(): Observable<void> {
    return this.api.authControllerRefreshToken({ withCredentials: true }).pipe(
      tap(() => this.hasAuthenticated.set(true)),
      shareReplay(1),
      catchError((err) => {
        this.clearAvatarHue();
        this.logout();
        // Перебрасываем ошибку дальше (например, для интерцептора)
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

    let headers = new HttpHeaders();
    if (isPlatformServer(this.platformId) && this.request) {
      const cookieHeader = this.request.headers.get('cookie');
      if (cookieHeader) {
        headers = headers.set('Cookie', cookieHeader);
      }
    }

    return this.usersApi.usersControllerGetProfile({ headers }).pipe(
      tap((userData) => {
        this.profile.set(userData);
        this.syncAvatarHueAfterProfileLoad(userData);
        this.authStatus.set(true);
        this.transferState.set(AUTH_KEY, true);
      }),
      map(() => true),
      catchError(() => {
        this.profile.set(undefined);
        this.clearAvatarHue();
        this.authStatus.set(false);
        this.transferState.set(AUTH_KEY, false);
        return of(false);
      }),
      shareReplay(1),
    );
  }

  isLoggedIn(): boolean {
    return this.authStatus() === true;
  }

  refreshToken(): Observable<void> {
    return this.api.authControllerRefreshToken({ withCredentials: true }).pipe(
      tap(() => this.hasAuthenticated.set(true)),
      shareReplay(1),
      catchError((err) => {
        this.logout();
        // Перебрасываем ошибку дальше (например, для интерцептора)
        return throwError(() => err);
      }),
    );
  }

  // isAuthenticated(): Observable<boolean> {
  //   const hasCookie =
  //     !!this.cookies.get(this.ACCESS_TOKEN_COOKIE) || !!this.cookies.get(this.REFRESH_TOKEN_COOKIE);
  //
  //   if (!hasCookie) {
  //     return of(false);
  //   }
  //
  //   if (!this.authState$) {
  //     const tokenCookie = this.cookies.get(this.ACCESS_TOKEN_COOKIE);
  //     const refreshTokenCookie = this.cookies.get(this.REFRESH_TOKEN_COOKIE);
  //     const cookieHeader =
  //       tokenCookie && refreshTokenCookie
  //         ? `access_token=${tokenCookie}; refresh_token=${refreshTokenCookie}`
  //         : tokenCookie
  //           ? `access_token=${tokenCookie}`
  //           : refreshTokenCookie
  //             ? `refresh_token=${refreshTokenCookie}`
  //             : COMMON_CONSTANTS.EMPTY_STRING;
  //
  //     const options =
  //       isPlatformServer(this.platformId) && cookieHeader
  //         ? { headers: new HttpHeaders({ Cookie: cookieHeader }) }
  //         : undefined;
  //
  //     this.authState$ = this.http.get('/api/v1/users/profile', options).pipe(
  //       map(() => true),
  //       catchError(() => of(false)),
  //       shareReplay(1),
  //     );
  //   }
  //
  //   return this.authState$;
  // }

  clearCache() {
    this.authState$ = undefined;
  }

  // login(data: { login: string; password: string }) {
  //   return this.http.post('/api/login', data).pipe(
  //     map(() => {
  //       this.clearCache();
  //       return true;
  //     }),
  //   );
  // }

  logout() {
    return this.http.post('/api/logout', {}).pipe(
      map(() => {
        this.clearCache();
        return true;
      }),
    );
  }

  /**
   * Новый случайный цвет аватара (вызывать после успешного логина).
   */
  assignRandomAvatarHueForSession(): void {
    const h = pickRandomAvatarHue();
    this.avatarHue.set(h);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.setItem(AVATAR_SESSION_HUE_KEY, String(h));
    }
  }

  private syncAvatarHueAfterProfileLoad(user: UserProfileResponseDto): void {
    if (isPlatformBrowser(this.platformId)) {
      const stored = parseStoredHue(sessionStorage.getItem(AVATAR_SESSION_HUE_KEY));
      if (stored !== null) {
        this.avatarHue.set(stored);
        return;
      }
      if (this.avatarHue() !== null) {
        return;
      }
      const h = stableHueFromSeed(user.userId);
      this.avatarHue.set(h);
      sessionStorage.setItem(AVATAR_SESSION_HUE_KEY, String(h));
      return;
    }
    this.avatarHue.set(stableHueFromSeed(user.userId));
  }

  private clearAvatarHue(): void {
    this.avatarHue.set(null);
    if (isPlatformBrowser(this.platformId)) {
      sessionStorage.removeItem(AVATAR_SESSION_HUE_KEY);
    }
  }
}
