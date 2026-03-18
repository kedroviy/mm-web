import { Injectable, inject } from '@angular/core';
import { CookieService } from './cookie.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of, shareReplay } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private cookies = inject(CookieService);
  private http = inject(HttpClient);

  private readonly SESSION_COOKIE = 'SESSION';

  private authState$?: Observable<boolean>;

  isAuthenticated(): Observable<boolean> {
    const hasCookie = !!this.cookies.get(this.SESSION_COOKIE);

    if (!hasCookie) {
      return of(false);
    }

    if (!this.authState$) {
      this.authState$ = this.http.get('/api/me').pipe(
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
