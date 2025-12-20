import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { User, UserProfile, UpdateUserRequest } from '../models/user.model';
import { ErrorHandlingService } from './error-handling.service';
import { API_ENDPOINTS } from '../constants/api-endpoints';
import { ApiUrlService } from './api-url.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private http = inject(HttpClient);
  private errorHandlingService = inject(ErrorHandlingService);
  private apiUrl = inject(ApiUrlService);

  constructor() { }

  /**
   * Get current user profile
   */
  getProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(this.apiUrl.url(API_ENDPOINTS.USERS.PROFILE))
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Update user profile
   */
  updateProfile(userData: UpdateUserRequest): Observable<UserProfile> {
    return this.http.put<UserProfile>(this.apiUrl.url(API_ENDPOINTS.USERS.PROFILE), userData)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Change user password
   */
  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    return this.http.post(this.apiUrl.url(API_ENDPOINTS.USERS.CHANGE_PASSWORD), {
      currentPassword,
      newPassword
    }).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Get user by ID (admin functionality)
   */
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(this.apiUrl.url(API_ENDPOINTS.USERS.GET_USER(id)))
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Get all users (admin functionality)
   */
  getUsers(page: number = 1, limit: number = 10): Observable<{ users: User[]; total: number }> {
    return this.http.get<{ users: User[]; total: number }>(this.apiUrl.url(API_ENDPOINTS.USERS.GET_USERS), {
      params: { page: page.toString(), limit: limit.toString() }
    }).pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Update user (admin functionality)
   */
  updateUser(id: string, userData: UpdateUserRequest): Observable<User> {
    return this.http.put<User>(this.apiUrl.url(API_ENDPOINTS.USERS.UPDATE_USER(id)), userData)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Delete user (admin functionality)
   */
  deleteUser(id: string): Observable<any> {
    return this.http.delete(this.apiUrl.url(API_ENDPOINTS.USERS.DELETE_USER(id)))
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Upload user avatar
   */
  uploadAvatar(file: File): Observable<{ avatarUrl: string }> {
    const formData = new FormData();
    formData.append('avatar', file);

    return this.http.post<{ avatarUrl: string }>(this.apiUrl.url(API_ENDPOINTS.USERS.UPLOAD_AVATAR), formData)
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }

  /**
   * Delete user avatar
   */
  deleteAvatar(): Observable<any> {
    return this.http.delete(this.apiUrl.url(API_ENDPOINTS.USERS.DELETE_AVATAR))
      .pipe(catchError(error => this.errorHandlingService.handleError(error)));
  }
}
