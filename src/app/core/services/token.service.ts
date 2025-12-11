import { Injectable } from '@angular/core';
import { AuthTokens } from '../models/auth-tokens.model';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  private readonly ACCESS_TOKEN_KEY = 'access_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly TOKEN_TYPE_KEY = 'token_type';
  private readonly EXPIRES_AT_KEY = 'expires_at';

  // Cookie security options
  private readonly cookieOptions = {
    secure: true,
    sameSite: 'strict' as const,
    httpOnly: false, // Set to false for client-side access, but consider server-side only tokens
    path: '/',
    domain: undefined // Will use current domain
  };

  constructor() { }

  /**
   * Store authentication tokens in secure cookies
   */
  setTokens(tokens: AuthTokens): void {
    const expiresAt = new Date(Date.now() + (tokens.expiresIn * 1000));

    this.setCookie(this.ACCESS_TOKEN_KEY, tokens.accessToken, expiresAt);
    this.setCookie(this.TOKEN_TYPE_KEY, tokens.tokenType, expiresAt);
    this.setCookie(this.EXPIRES_AT_KEY, expiresAt.toISOString(), expiresAt);

    if (tokens.refreshToken) {
      // Refresh token should have a longer expiry
      const refreshExpiresAt = new Date(Date.now() + (30 * 24 * 60 * 60 * 1000)); // 30 days
      this.setCookie(this.REFRESH_TOKEN_KEY, tokens.refreshToken, refreshExpiresAt);
    }
  }

  /**
   * Get access token from cookies
   */
  getAccessToken(): string | null {
    return this.getCookie(this.ACCESS_TOKEN_KEY);
  }

  /**
   * Get refresh token from cookies
   */
  getRefreshToken(): string | null {
    return this.getCookie(this.REFRESH_TOKEN_KEY);
  }

  /**
   * Get token type from cookies
   */
  getTokenType(): string {
    return this.getCookie(this.TOKEN_TYPE_KEY) || 'Bearer';
  }

  /**
   * Get formatted authorization header value
   */
  getAuthorizationHeader(): string | null {
    const token = this.getAccessToken();
    const tokenType = this.getTokenType();

    if (!token) {
      return null;
    }

    return `${tokenType} ${token}`;
  }

  /**
   * Check if user is authenticated (token exists and not expired)
   */
  isAuthenticated(): boolean {
    const token = this.getAccessToken();
    const expiresAt = this.getTokenExpiration();

    if (!token || !expiresAt) {
      return false;
    }

    return new Date() < expiresAt;
  }

  /**
   * Get token expiration date
   */
  getTokenExpiration(): Date | null {
    const expiresAtStr = this.getCookie(this.EXPIRES_AT_KEY);
    if (!expiresAtStr) {
      return null;
    }

    return new Date(expiresAtStr);
  }

  /**
   * Clear all authentication tokens
   */
  clearTokens(): void {
    this.deleteCookie(this.ACCESS_TOKEN_KEY);
    this.deleteCookie(this.REFRESH_TOKEN_KEY);
    this.deleteCookie(this.TOKEN_TYPE_KEY);
    this.deleteCookie(this.EXPIRES_AT_KEY);
  }

  /**
   * Check if token is expired or about to expire (within 5 minutes)
   */
  isTokenExpired(bufferMinutes: number = 5): boolean {
    const expiresAt = this.getTokenExpiration();
    if (!expiresAt) {
      return true;
    }

    const bufferTime = bufferMinutes * 60 * 1000; // Convert to milliseconds
    return new Date(Date.now() + bufferTime) >= expiresAt;
  }

  /**
   * Private helper methods for cookie operations
   */
  private setCookie(name: string, value: string, expires: Date): void {
    let cookieString = `${name}=${encodeURIComponent(value)}; expires=${expires.toUTCString()}; path=${this.cookieOptions.path}`;

    if (this.cookieOptions.secure) {
      cookieString += '; secure';
    }

    if (this.cookieOptions.sameSite) {
      cookieString += `; samesite=${this.cookieOptions.sameSite}`;
    }

    if (this.cookieOptions.domain) {
      cookieString += `; domain=${this.cookieOptions.domain}`;
    }

    document.cookie = cookieString;
  }

  private getCookie(name: string): string | null {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');

    for (let i = 0; i < ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }
      if (c.indexOf(nameEQ) === 0) {
        return decodeURIComponent(c.substring(nameEQ.length, c.length));
      }
    }
    return null;
  }

  private deleteCookie(name: string): void {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${this.cookieOptions.path}`;

    if (this.cookieOptions.domain) {
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=${this.cookieOptions.path}; domain=${this.cookieOptions.domain}`;
    }
  }
}
