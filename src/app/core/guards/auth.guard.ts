import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  // Проверяем сигнал. Больше никаких Observable в гвардах!
  if (auth.isLoggedIn()) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
