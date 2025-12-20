import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {

      // Routes that should NOT trigger logout
      const skipLogoutPaths = [
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
        '/logout'
      ];

      const shouldSkipLogout = skipLogoutPaths.some(path =>
        req.url.includes(path)
      );

      // 🔐 Unauthorized → token expired / revoked
      if (error.status === 401 && !shouldSkipLogout) {
        router.navigate(['/auth/login']);
      }

      // 🚫 Forbidden
      if (error.status === 403) {
        console.warn('Forbidden request:', req.url);
      }

      // 🌐 Network error
      if (error.status === 0) {
        console.error('Network error – check backend or CORS');
      }

      // 🔥 Server error
      if (error.status >= 500) {
        console.error('Server error:', error.message);
      }

      logHttpError(error);
      return throwError(() => error);
    })
  );
};

/**
 * Log error details (can be extended to Sentry, etc.)
 */
function logHttpError(error: HttpErrorResponse): void {
  console.error('HTTP Error', {
    status: error.status,
    url: error.url,
    message: error.message,
    time: new Date().toISOString()
  });
}