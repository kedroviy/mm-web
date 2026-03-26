import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { CookieService } from './cookie.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { isPlatformServer } from '@angular/common';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookies = inject(CookieService);
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);

  private readonly ACCESS_TOKEN_COOKIE = 'access_token';
  private readonly REFRESH_TOKEN_COOKIE = 'refresh_token';

  private authState$?: Observable<boolean>;

  isAuthenticated(): Observable<boolean> {
    // Tokens are set by the backend as HTTP-only cookies.
    // On the server we can read them from request.headers.cookie.
    const hasCookie = !!this.cookies?.get(this.ACCESS_TOKEN_COOKIE) || !!this.cookies?.get(this.REFRESH_TOKEN_COOKIE);

    if (!hasCookie) {
      return of(false);
    }

    if (!this.authState$) {
      // For SSR: Angular runs this request from the server, so we must forward cookies manually.
      const tokenCookie = this.cookies?.get(this.ACCESS_TOKEN_COOKIE);
      const refreshTokenCookie = this.cookies?.get(this.REFRESH_TOKEN_COOKIE);
      const cookieHeader =
        tokenCookie && refreshTokenCookie
          ? `access_token=${tokenCookie}; refresh_token=${refreshTokenCookie}`
          : tokenCookie
            ? `access_token=${tokenCookie}`
            : refreshTokenCookie
              ? `refresh_token=${refreshTokenCookie}`
              : '';

      const options = isPlatformServer(this.platformId) && cookieHeader
        ? { headers: new HttpHeaders({ Cookie: cookieHeader }) }
        : undefined;

      // Backend check endpoint: current user profile.
      // If user is not authenticated, backend should respond with 401/403.
      this.authState$ = this.http.get('/api/v1/users/profile', options).pipe(
        map(() => true),
        catchError(() => of(false)),
        shareReplay(1),
      );
    }

    return this.authState$;
  }

  clearCache() {
    this.authState$ = undefined;
  }

  login(data: { login: string; password: string }) {
    return this.http.post('/api/login', data).pipe(
      map(() => {
        this.clearCache();
        return true;
      }),
    );
  }

  logout() {
    return this.http.post('/api/logout', {}).pipe(
      map(() => {
        this.clearCache();
        return true;
      }),
    );
  }
}
