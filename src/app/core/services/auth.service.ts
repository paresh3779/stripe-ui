import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';

import { User } from '../models/user.model';
import {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  RegisterResponse,
  RefreshTokenResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest
} from '../models/auth-tokens.model';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_BASE_URL = '/api/auth'; // Adjust based on your API endpoint

  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router
  ) {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.API_BASE_URL}/login`, credentials)
      .pipe(
        tap(response => {
          this.handleAuthenticationSuccess(response.user, response.tokens);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Register new user
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.API_BASE_URL}/register`, userData)
      .pipe(
        tap(response => {
          this.handleAuthenticationSuccess(response.user, response.tokens);
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Logout user
   */
  logout(): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/logout`, {})
      .pipe(
        tap(() => {
          this.handleLogout();
        }),
        catchError(error => {
          // Even if logout fails on server, clear local state
          this.handleLogout();
          return throwError(error);
        })
      );
  }

  /**
   * Refresh access token
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.tokenService.getRefreshToken();

    if (!refreshToken) {
      return throwError('No refresh token available');
    }

    return this.http.post<RefreshTokenResponse>(`${this.API_BASE_URL}/refresh`, {
      refreshToken
    }).pipe(
      tap(response => {
        // Update tokens in cookies
        const tokens: AuthTokens = {
          accessToken: response.accessToken,
          tokenType: response.tokenType,
          expiresIn: response.expiresIn,
          issuedAt: new Date()
        };
        this.tokenService.setTokens(tokens);
      }),
      catchError(error => {
        this.handleLogout();
        return throwError(error);
      })
    );
  }

  /**
   * Forgot password
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/forgot-password`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Reset password
   */
  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/reset-password`, request)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get current user
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.tokenService.isAuthenticated();
  }

  /**
   * Check authentication status and update subjects
   */
  private checkAuthStatus(): void {
    const isAuth = this.tokenService.isAuthenticated();
    this.isAuthenticatedSubject.next(isAuth);

    if (isAuth) {
      // Try to get user profile if authenticated
      this.getUserProfile().subscribe({
        next: (user) => {
          this.currentUserSubject.next(user);
        },
        error: () => {
          // If we can't get user profile, clear authentication
          this.handleLogout();
        }
      });
    }
  }

  /**
   * Get user profile from API
   */
  private getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/profile`);
  }

  /**
   * Handle successful authentication
   */
  private handleAuthenticationSuccess(user: User, tokens: AuthTokens): void {
    this.tokenService.setTokens(tokens);
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Handle logout
   */
  private handleLogout(): void {
    this.tokenService.clearTokens();
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }

  /**
   * Handle HTTP errors
   */
  private handleError = (error: HttpErrorResponse): Observable<never> => {
    let errorMessage = 'An unknown error occurred';

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = 'Bad request. Please check your input.';
          break;
        case 401:
          errorMessage = 'Unauthorized. Please login again.';
          this.handleLogout();
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'Resource not found.';
          break;
        case 422:
          errorMessage = 'Validation error. Please check your input.';
          break;
        case 500:
          errorMessage = 'Internal server error. Please try again later.';
          break;
        default:
          errorMessage = `Error ${error.status}: ${error.message}`;
      }
    }

    console.error('AuthService Error:', error);
    return throwError(errorMessage);
  };
}
