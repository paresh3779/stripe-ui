import { Injectable, inject } from '@angular/core';
import { AppConfig } from '../../config.service';

/**
 * Helper for building full API URLs from the configured base URL and a relative endpoint.
 */
@Injectable({ providedIn: 'root' })
export class ApiUrlService {

  private config = inject(AppConfig);

  /**
   * Build a full API URL for a given relative endpoint.
   * @param endpoint Relative endpoint path (example: "users/profile").
   */
  url(endpoint: string): string {
    return `${this.config.apiUrl}/${endpoint}`;
  }
}
