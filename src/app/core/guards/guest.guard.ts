import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.checkAuth().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        return router.parseUrl('/dashboard/home');
      }
      return true;
    }),
  );
};
