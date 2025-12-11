import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';

import { TokenService } from '../services/token.service';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate, CanActivateChild {

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private router: Router
  ) { }

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
   * Check if user is authenticated and handle token refresh if needed
   */
  private checkAuthentication(url: string): Observable<boolean> {
    // First check if we have a valid token
    if (this.tokenService.isAuthenticated()) {
      return of(true);
    }

    // Check if token is expired but we have a refresh token
    const refreshToken = this.tokenService.getRefreshToken();
    if (refreshToken && this.tokenService.isTokenExpired()) {
      // Try to refresh the token
      return this.authService.refreshToken().pipe(
        map(() => {
          // Token refreshed successfully
          return true;
        }),
        catchError(() => {
          // Token refresh failed, redirect to login
          this.redirectToLogin(url);
          return of(false);
        })
      );
    }

    // No valid token, redirect to login
    this.redirectToLogin(url);
    return of(false);
  }

  /**
   * Redirect to login page with return URL
   */
  private redirectToLogin(returnUrl: string): void {
    this.router.navigate(['/auth/login'], {
      queryParams: { returnUrl },
      replaceUrl: true
    });
  }
}
