import { Injectable } from '@angular/core';
import { AuthTokens } from '../models/auth-tokens.model';

/**
 * TokenService handles authentication state for Laravel Sanctum.
 * Since Sanctum manages tokens via HTTP-only cookies, this service focuses on auth state management.
 */
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  /**
   * Check if user is authenticated.
   * @returns boolean False, as auth state is managed by AuthService based on API responses.
   */
  isAuthenticated(): boolean {
    return false; // Auth state is checked via AuthService and API calls
  }
}
