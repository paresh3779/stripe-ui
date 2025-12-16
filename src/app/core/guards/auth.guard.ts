import { Injectable, inject } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { AuthService } from '../services/auth.service';

/**
 * AuthGuard protects routes by checking authentication status and refreshing tokens if needed.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Check if user is authenticated and handle token refresh if needed.
   * @param route The activated route snapshot.
   * @param state The router state snapshot.
   * @returns Observable<boolean> | Promise<boolean> | boolean True if access is allowed.
   */
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.checkAuthentication(state.url);
  }

  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> | Promise<boolean> | boolean {
    return this.canActivate(childRoute, state);
  }

  /**
   * Check if user is authenticated.
   * @param url The URL to redirect to if not authenticated.
   * @returns Observable<boolean> True if authenticated.
   */
  private checkAuthentication(url: string): Observable<boolean> {
    // First check if we have auth state
    if (this.authService.isAuthenticated()) {
      return of(true);
    }

    // If not authenticated, redirect to login
    this.redirectToLogin(url);
    return of(false);
  }

  /**
   * Redirect to login page with return URL.
   * @param returnUrl The URL to return to after login.
   */
  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true
    });
  }
}
