import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '@env/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  let url = req.url;
  if (url.startsWith('/api/')) {
    url = `${environment.apiBaseUrl}${url}`;
  }

  const cloned = req.clone({
    url,
    withCredentials: true,
  });

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        if (typeof window !== 'undefined') {
          router.navigate(['/auth/login']);
        }
      }

      return throwError(() => err);
    }),
  );
};
