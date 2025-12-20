import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * Prevents authenticated users from accessing auth pages (login/register).
 * Redirects authenticated users to /main.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  canActivate(): boolean {
    const isAuth = this.authService.isAuthenticated();
    console.log('[AuthRedirectGuard] isAuthenticated:', isAuth);
    
    if (isAuth) {
      console.log('[AuthRedirectGuard] Redirecting authenticated user to /main');
      this.router.navigate(['/main']);
      return false;
    }
    
    console.log('[AuthRedirectGuard] Allowing unauthenticated user to access auth page');
    return true;
  }
}
