import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User, UserProfile, UpdateUserRequest } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly API_BASE_URL = '/api/users'; // Adjust based on your API endpoint

  constructor(private http: HttpClient) { }

  /**
   * Get current user profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.API_BASE_URL}/profile`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Update user profile
   */
  updateProfile(userData: UpdateUserRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(`${this.API_BASE_URL}/profile`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/change-password`, {
      currentPassword,
      newPassword
    }).pipe(catchError(this.handleError));
  }

  /**
   * Get user by ID (admin functionality)
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.API_BASE_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Get all users (admin functionality)
   */
  getUsers(page: number = 1, limit: number = 10): Observable<{ users: User[]; total: number }> {
    return this.http.get<{ users: User[]; total: number }>(`${this.API_BASE_URL}`, {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(catchError(this.handleError));
  }

  /**
   * Update user (admin functionality)
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(`${this.API_BASE_URL}/${id}`, userData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete user (admin functionality)
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/${id}`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<{ avatarUrl: string }>(`${this.API_BASE_URL}/avatar`, formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Delete user avatar
   */
  deleteAvatar(): Observable<any> {
    return this.http.delete(`${this.API_BASE_URL}/avatar`)
      .pipe(catchError(this.handleError));
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
          break;
        case 403:
          errorMessage = 'Forbidden. You do not have permission.';
          break;
        case 404:
          errorMessage = 'User not found.';
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

    console.error('UserService Error:', error);
    return throwError(errorMessage);
  };
}
