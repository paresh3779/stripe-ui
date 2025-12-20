import { ApplicationConfig, APP_INITIALIZER, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth.service';

function initializeAuth(authService: AuthService): () => Promise<void> {
  return () => authService.initializeAuth();
}

export const appConfig: ApplicationConfig = {
  providers: [
    // Global error listeners
    provideBrowserGlobalErrorListeners(),

    // Router configuration
    provideRouter(routes),

    // HttpClient with functional interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,   // Adds withCredentials
        errorInterceptor   // Handles 401/403/network/server errors
      ])
    ),

    // Initialize authentication before app starts
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAuth,
      deps: [AuthService],
      multi: true
    }
  ]
};
