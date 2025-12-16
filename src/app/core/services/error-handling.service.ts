import { Injectable } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { AUTH_MESSAGES } from '../constants/validation-messages';

/**
 * ErrorHandlingService provides common error handling utilities for HTTP requests.
 * Centralizes error message generation and follows Angular best practices for error management.
 */
@Injectable({
  providedIn: 'root'
})
export class ErrorHandlingService {

  /**
   * Handle HTTP errors and return user-friendly error messages.
   * @param error The HTTP error response.
   * @returns Observable<never> Throws an error with a user-friendly message.
   */
  handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.status in AUTH_MESSAGES.ERROR_MESSAGE) {
        errorMessage = AUTH_MESSAGES.ERROR_MESSAGE[error.status as keyof typeof AUTH_MESSAGES.ERROR_MESSAGE] as string;
      } else {
        errorMessage = AUTH_MESSAGES.ERROR_MESSAGE.default(error.status, error.message);
      }
    }

    console.error('ErrorHandlingService Error:', error);
    return throwError(() => errorMessage);
  }
}
