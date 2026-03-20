import { AuthService as CustomAuthService } from '@core/services/auth/auth.service';
import { catchError, of } from 'rxjs';

export function initializeAuth(authService: CustomAuthService) {
  return () => authService.initAuth().pipe(catchError(() => of(false)));
}
