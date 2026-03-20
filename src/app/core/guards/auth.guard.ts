import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthFacade } from '@core/services/auth/auth.facade';

export const authGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  if (authFacade.authStatus() === true) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
