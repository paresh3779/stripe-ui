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
    console.log("coming")
    if (this.authService.isAuthenticated()) {
      console.log("20");
      // User is logged in, redirect to main
      this.router.navigate(['/main']);
      return false;
    }
    console.log("25");
    // User is not logged in, allow access to auth pages
    return true;
  }
}
