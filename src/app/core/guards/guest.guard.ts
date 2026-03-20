import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthFacade } from '@core/services/auth/auth.facade'; // проверь путь

export const guestGuard: CanActivateFn = () => {
  const authFacade = inject(AuthFacade);
  const router = inject(Router);

  // Так как инициализация была в APP_INITIALIZER,
  // сигнал authStatus уже содержит актуальное значение.
  if (authFacade.authStatus() === true) {
    return router.parseUrl('/dashboard/home');
  }

  return true;
};
