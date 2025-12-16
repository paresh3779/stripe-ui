import { Injectable, inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

/**
 * AuthRedirectGuard redirects authenticated users away from auth pages (login/register) to the main page.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthRedirectGuard implements CanActivate {

  private authService = inject(AuthService);
  private router = inject(Router);

  canActivate(): boolean {
    if (this.authService.isAuthenticated()) {
      // User is logged in, redirect to main
      this.router.navigate(['/main']);
      return false;
    }
    // User is not logged in, allow access to auth pages
    return true;
  }
}
