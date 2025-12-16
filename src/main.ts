import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { AppConfig } from './app/config.service';
import { AuthInterceptor } from './app/core/interceptors/auth.interceptor';
import { ErrorInterceptor } from './app/core/interceptors/error.interceptor';

async function bootstrap(): Promise<void> {
  try {
    // Create and load runtime configuration
    const appConfig = new AppConfig();
    await appConfig.load();

    // Bootstrap Angular application
    await bootstrapApplication(App, {
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(routes),
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        { provide: AppConfig, useValue: appConfig }
      ]
    });

    // Optional: keep this only in development
    console.info('Angular application bootstrapped');
  } catch (error) {
    console.error('Application bootstrap failed', error);
  }
}

bootstrap();
