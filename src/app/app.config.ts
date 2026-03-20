import {
  APP_INITIALIZER,
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { authInterceptor } from '@core/interceptors/auth-interceptor';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { initializeAuth } from '@core/utils/fabrics/initialize-auth';
import { AuthFacade } from '@core/services/auth/auth.facade';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
      },
    },
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthFacade],
      multi: true,
    },
  ],
};
