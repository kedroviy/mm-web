import { AuthFacade } from '@core/services/auth/auth.facade'; // проверь путь
import { catchError, of } from 'rxjs';

export function initializeAuth(authFacade: AuthFacade) {
  // Вызываем checkAuth из фасада, который сделает запрос через Orval
  // и заполнит сигналы профиля и статуса
  return () => authFacade.checkAuth().pipe(catchError(() => of(false)));
}
