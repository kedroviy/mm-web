import {
  Injectable,
  inject,
  PLATFORM_ID,
  signal,
  REQUEST,
  TransferState,
  makeStateKey,
} from '@angular/core';
import { CookieService } from './cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { catchError, map, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { COMMON_CONSTANTS } from '@core/constants';

const AUTH_KEY = makeStateKey<boolean>('auth_state');

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookies = inject(CookieService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private readonly ACCESS_TOKEN_COOKIE = 'access_token';
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token';
  private request = inject(REQUEST, { optional: true });
  private transferState = inject(TransferState);
  private authState$?: Observable<boolean>;
  readonly authStatus = signal<boolean | null>(null);
  hasAuthenticated = signal<boolean | null>(null);

  initAuth(): Observable<boolean> {
    return this.http.get('/api/v1/users/profile').pipe(
      map(() => {
        this.authStatus.set(true);
        return true;
      }),
      catchError(() => {
        this.authStatus.set(false);
        return of(false);
      }),
    );
  }

  checkAuth(): Observable<boolean> {
    if (this.transferState.hasKey(AUTH_KEY)) {
      const isAuth = this.transferState.get(AUTH_KEY, false);
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

    return this.http.get('/api/v1/users/profile', { headers }).pipe(
      map(() => true),
      catchError(() => of(false)),
      tap((isAuth) => {
        this.authStatus.set(isAuth);
        this.transferState.set(AUTH_KEY, isAuth);
      }),
      shareReplay(1),
    );
  }

  isLoggedIn(): boolean {
    console.log('auth status: ', this.authStatus() === true);
    return this.authStatus() === true;
  }

  refreshToken(): Observable<any> {
    return this.http.post('/api/v1/auth/refresh', {}, { withCredentials: true }).pipe(
      tap(() => this.hasAuthenticated.set(true)),
      shareReplay(1),
      catchError((err) => {
        this.logout();
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
}
