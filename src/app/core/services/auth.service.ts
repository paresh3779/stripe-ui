import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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
import { AUTH_MESSAGES } from '../constants/validation-messages';
import { ErrorHandlingService } from './error-handling.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiUrlService } from './api-url.service';
import { NotificationService } from './notification.service';

/**
 * AuthService handles authentication-related operations such as login, registration, logout, token refresh, forgot password, and reset password.
 * It manages user state, authentication status, and communicates with the backend API for authentication tasks.
 * Laravel Sanctum handles token management via HTTP-only cookies.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private http = inject(HttpClient);
  private router = inject(Router);
  private errorHandlingService = inject(ErrorHandlingService);
  private apiUrl = inject(ApiUrlService);
  private notification = inject(NotificationService);


  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check authentication status on service initialization
    this.checkAuthStatus();
  }

  /**
   * Login user with email and password.
   * @param credentials The login request containing email and password.
   * @returns Observable<LoginResponse> The login response with user data and tokens.
   */
  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(this.apiUrl.url(API_ENDPOINTS.AUTH.LOGIN), credentials)
      .pipe(
        tap(response => {
          this.handleAuthenticationSuccess(response.user, response.tokens);
          this.notification.success(AUTH_MESSAGES.SUCCESS_MESSAGE.login);
        }),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  /**
   * Register a new user.
   * @param userData The registration data including first_name, last_name, email, and password.
   * @returns Observable<RegisterResponse> The registration response with user data and tokens.
   */
  register(userData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.apiUrl.url(API_ENDPOINTS.AUTH.REGISTER), userData)
      .pipe(
        tap(response => {
          this.handleAuthenticationSuccess(response.user, response.tokens);
          this.notification.success(AUTH_MESSAGES.SUCCESS_MESSAGE.register);
        }),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  /**
   * Logout user.
   * @returns Observable<any> The logout response.
   */
  logout(): Observable<any> {
    return this.http.post(this.apiUrl.url(API_ENDPOINTS.AUTH.LOGOUT), {})
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
   * Refresh access token.
   * @returns Observable<RefreshTokenResponse> The refresh token response with new access token.
   */
  refreshToken(): Observable<RefreshTokenResponse> {
    return this.http.post<RefreshTokenResponse>(this.apiUrl.url(API_ENDPOINTS.AUTH.REFRESH), {})
      .pipe(
        tap(response => {
          // Laravel Sanctum sets the new token in cookie
        }),
        catchError(error => {
          this.handleLogout();
          return this.errorHandlingService.handleError(error);
        })
      );
  }

  /**
   * Send forgot password request.
   * @param request The forgot password request with email.
   * @returns Observable<any> The response.
   */
  forgotPassword(request: ForgotPasswordRequest): Observable<any> {
    return this.http.post(this.apiUrl.url(API_ENDPOINTS.AUTH.FORGOT_PASSWORD), request)
      .pipe(
        tap(() => this.notification.info(AUTH_MESSAGES.SUCCESS_MESSAGE.forgotPassword)),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  /**
   * Reset password with token.
   * @param request The reset password request with token, password, confirmPassword.
   * @returns Observable<any> The response.
   */
  resetPassword(request: ResetPasswordRequest): Observable<any> {
    return this.http.post(this.apiUrl.url(API_ENDPOINTS.AUTH.RESET_PASSWORD), request)
      .pipe(
        tap(() => this.notification.success(AUTH_MESSAGES.SUCCESS_MESSAGE.resetPassword)),
        catchError(error => this.errorHandlingService.handleError(error))
      );
  }

  /**
   * Get current user.
   * @returns User | null The current user or null.
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Check if user is authenticated.
   * @returns boolean True if authenticated.
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Check authentication status and update subjects.
   */
  private checkAuthStatus(): void {
    // Try to get user profile to check authentication
    this.getUserProfile().subscribe({
      next: (user) => {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      },
      error: () => {
        // If we can't get user profile, user is not authenticated
        this.currentUserSubject.next(null);
        this.isAuthenticatedSubject.next(false);
      }
    });
  }

  /**
   * Get user profile from API.
   * @returns Observable<User>
   */
  private getUserProfile(): Observable<User> {
    return this.http.get<User>(this.apiUrl.url(API_ENDPOINTS.AUTH.PROFILE));
  }

  /**
   * Handle successful authentication.
   * @param user The user data.
   * @param tokens The authentication tokens.
   */
  private handleAuthenticationSuccess(user: User, tokens: AuthTokens): void {
    this.currentUserSubject.next(user);
    this.isAuthenticatedSubject.next(true);
    setTimeout(() => this.router.navigate(['/main']), 0);
  }

  /**
   * Handle logout.
   */
  private handleLogout(): void {
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
    this.router.navigate(['/auth/login']);
  }
}
