import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  const cloned = req.clone({
    withCredentials: true, // всегда отправляем cookie
  });

  return next(cloned).pipe(
    catchError((err) => {
      if (err.status === 401) {
        // важно: не делать редирект на сервере
        if (typeof window !== 'undefined') {
          router.navigate(['/login']);
        }
      }

      return throwError(() => err);
    }),
  );
};
