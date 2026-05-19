import { isPlatformServer } from '@angular/common';
import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';
import { AuthService } from '@core/services/auth/auth.service';

function resolveApiUrl(url: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }

  if (url.startsWith('/')) {
    return `${environment.apiBaseUrl}${url}`;
  }

  return url;
}

function isPublicAuthRequest(url: string): boolean {
  return (
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/verify-id-token') ||
    url.includes('/auth/send-code-to-email') ||
    url.includes('/auth/verify-code')
  );
}

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const platformId = inject(PLATFORM_ID);

  const url = resolveApiUrl(req.url);
  const token = authService.getAccessToken();

  let headers = req.headers;
  if (token && !isPublicAuthRequest(url)) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  const cloned = req.clone({ url, headers, withCredentials: true });

  return next(cloned).pipe(
    catchError((err) => {
      if (
        err instanceof HttpErrorResponse &&
        err.status === 401 &&
        !isPublicAuthRequest(url)
      ) {
        if (isPlatformServer(platformId)) {
          return throwError(() => err);
        }

        authService.logout().subscribe();
        void router.navigate(['/auth/login']);
      }

      return throwError(() => err);
    }),
  );
};
