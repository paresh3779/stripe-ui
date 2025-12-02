import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { AppConfig } from './app/config.service';

const appConfigService = new AppConfig();
appConfigService.load().then(() => {
  bootstrapApplication(App, appConfig)
    .catch((err) => console.error(err));
});