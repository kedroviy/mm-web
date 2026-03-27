import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '@core/services/auth/auth.service';
import { map } from 'rxjs';

export const guestGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.checkAuth().pipe(
    map((isLoggedIn) => {
      if (isLoggedIn) {
        // Если пользователь УЖЕ внутри дашборда (перезагрузка страницы),
        // не нужно его никуда перекидывать, просто разрешаем (true)
        if (state.url.startsWith('/dashboard')) {
          return true;
        }

        // А если он ломится на /auth/login, будучи залогиненным — тогда на home
        return router.parseUrl('/dashboard/home');
      }

      // Если не залогинен — разрешаем доступ к гостевой странице (логину)
      return true;
    }),
  );
};
