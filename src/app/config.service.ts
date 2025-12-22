import { Injectable } from '@angular/core';

export interface AppConfigModel {
  API_URL: string;
  STRIPE_PUBLISHABLE_KEY: string;
}

@Injectable({ providedIn: 'root' })
export class AppConfig {

  private config: Partial<AppConfigModel> = {};

  async load(): Promise<void> {
    try {
      const response = await fetch('config.json');

      if (!response.ok) {
        console.warn('[AppConfig] config.json not found. Using defaults.');
        return;
      }

      this.config = await response.json();
    } catch (error) {
      console.error('[AppConfig] Failed to load config.json', error);
      this.config = {};
    }
  }

  /** Base API URL */
  get apiUrl(): string {
    return this.config.API_URL ?? '/api';
  }

  /** Stripe Publishable Key */
  get stripePublishableKey(): string {
    return this.config.STRIPE_PUBLISHABLE_KEY ?? '';
  }
}
