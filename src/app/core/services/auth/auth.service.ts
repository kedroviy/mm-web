import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay, tap, catchError, throwError } from 'rxjs';
import { AuthFacade } from '@core/services/auth/auth.facade';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private authFacade = inject(AuthFacade);

  hasAuthenticated = signal<boolean | null>(null);
  readonly profile = this.authFacade.profile;
  readonly authStatus = this.authFacade.authStatus;

  isLoggedIn(): boolean {
    return this.authStatus() === true;
  }

  refreshToken(): Observable<unknown> {
    return this.http.post('/api/v1/auth/refresh', {}, { withCredentials: true }).pipe(
      tap(() => this.hasAuthenticated.set(true)),
      shareReplay(1),
      catchError((err) => {
        this.authFacade.logout();
        return throwError(() => err);
      }),
    );
  }

  logout() {
    this.authFacade.logout();
  }
}
