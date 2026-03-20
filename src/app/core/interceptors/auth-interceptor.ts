import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, switchMap, BehaviorSubject, filter, take, finalize } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '../services/auth/auth.service';

let isRefreshing = false;
const refreshTokenSubject = new BehaviorSubject<boolean | null>(null);

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  let url = req.url;
  if (url.startsWith('/api/')) {
    url = `${environment.apiBaseUrl}${url}`;
  }

  const cloned = req.clone({ url, withCredentials: true });

  return next(cloned).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        !req.url.includes('/login') &&
        !req.url.includes('/refresh')
      ) {
        if (isRefreshing) {
          return refreshTokenSubject.pipe(
            filter((result) => result !== null),
            take(1),
            switchMap(() => next(req.clone({ url, withCredentials: true }))),
          );
        }

        isRefreshing = true;
        refreshTokenSubject.next(null);

        return authService.refreshToken().pipe(
          switchMap(() => {
            isRefreshing = false;
            refreshTokenSubject.next(true);
            return next(req.clone({ url, withCredentials: true }));
          }),
          catchError((refreshErr) => {
            isRefreshing = false;
            refreshTokenSubject.next(false);

            authService.logout();
            if (typeof window !== 'undefined') {
              router.navigate(['/auth/login']);
            }
            return throwError(() => refreshErr);
          }),
        );
      }

      return throwError(() => err);
    }),
  );
};
