import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VALIDATION_MESSAGES } from '@core/constants/validation-messages';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { FORM_LABELS } from '@core/constants/form-labels';
import { PAGE_HEADINGS } from '@core/constants/page-headings';
import { BUTTON_LABELS } from '@core/constants/button-labels';
import { ROUTE_LABELS } from '@core/constants/button-labels';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

/**
 * Login component handles user login functionality.
 * It provides a form for email and password input and calls the AuthService for authentication.
 */
@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule
  ],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login implements OnInit {
  loginForm!: FormGroup;

  pageHeading = PAGE_HEADINGS.auth.login;
  formLabels = FORM_LABELS.login;
  errorMessages = VALIDATION_MESSAGES;
  buttonLabels = BUTTON_LABELS.auth;
  routeLabels = ROUTE_LABELS.auth;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  /**
   * Initializes the login form with email and password fields.
   * Sets up form validation using FormBuilder.
   */
  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]]
    });
  }

  /**
   * Handles the login form submission.
   * Validates the form and calls AuthService.login().
   */
  login() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => {
          this.router.navigate(['/']); // Navigate to home/dashboard on success
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }
  }
}
