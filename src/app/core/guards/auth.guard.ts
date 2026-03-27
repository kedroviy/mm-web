import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { map } from 'rxjs';

// auth.guard.ts
export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return true;
      }
      return router.parseUrl('/auth/login');
    }),
  );
};
