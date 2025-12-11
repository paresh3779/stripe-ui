import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        return this.handleError(error, request, next);
      })
    );
  }

  /**
   * Handle HTTP errors
   */
  private handleError(error: HttpErrorResponse, request: HttpRequest<any>, next: HttpHandler): Observable<never> {
    // Skip error handling for auth endpoints that should not trigger logout
    const skipLogoutUrls = [
      '/api/auth/login',
      '/api/auth/register',
      '/api/auth/forgot-password',
      '/api/auth/reset-password'
    ];

    const shouldSkipLogout = skipLogoutUrls.some(url => request.url.includes(url));

    if (error.status === 401 && !shouldSkipLogout) {
      // Token expired or invalid, clear authentication and redirect to login
      this.authService.logout().subscribe();
      return throwError(error);
    }

    if (error.status === 403) {
      // Forbidden - user doesn't have permission
      console.warn('Access forbidden:', error);
      // You might want to show a notification here
    }

    if (error.status === 0) {
      // Network error
      console.error('Network error - please check your connection');
    }

    if (error.status >= 500) {
      // Server error
      console.error('Server error:', error);
    }

    // Log error details for debugging
    this.logError(error);

    // Re-throw the error so components can handle it
    return throwError(error);
  }

  /**
   * Log error details for debugging
   */
  private logError(error: HttpErrorResponse): void {
    const errorDetails = {
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message,
      timestamp: new Date().toISOString()
    };

    console.error('HTTP Error:', errorDetails);

    // In production, you might want to send this to an error reporting service
    // this.errorReportingService.reportError(errorDetails);
  }
}
