import { bootstrapApplication } from '@angular/platform-browser';

import { App } from './app/app';
import { appConfig } from './app/app.config';
import { AppConfig } from './app/config.service';

async function bootstrap(): Promise<void> {
  try {
    // Create and load runtime configuration
    const runtimeConfig = new AppConfig();
    await runtimeConfig.load();

    // Bootstrap Angular application with appConfig
    await bootstrapApplication(App, {
      providers: [
        ...appConfig.providers,
        { provide: AppConfig, useValue: runtimeConfig }
      ]
    });

    console.info('Angular application bootstrapped');
  } catch (error) {
    console.error('Application bootstrap failed', error);
  }
}

bootstrap();