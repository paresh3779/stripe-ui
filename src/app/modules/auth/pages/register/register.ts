import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { VALIDATION_MESSAGES } from '@core/constants/validation-messages';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { confirmPasswordValidator } from '@core/validators/confirm-password.validator';
import { FORM_LABELS } from '@core/constants/form-labels';
import { PAGE_HEADINGS } from '@core/constants/page-headings';
import { BUTTON_LABELS } from '@core/constants/button-labels';
import { ROUTE_LABELS } from '@core/constants/button-labels';
import { AuthService } from '@core/services/auth.service';
import { Router } from '@angular/router';

/**
 * Register component handles user registration functionality.
 * It provides a form for user details and calls the AuthService for registration.
 */
@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerForm!: FormGroup;

  pageHeading = PAGE_HEADINGS.auth.register;
  formLabels = FORM_LABELS.register;
  errorMessages = VALIDATION_MESSAGES;
  buttonLabels = BUTTON_LABELS.auth;
  routeLabels = ROUTE_LABELS.auth;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.registerForm = this.fb.group({
      first_name: ['', [Validators.required, Validators.minLength(3)]],
      last_name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]]
    });
  }

  /**
   * Handles the register form submission.
   * Validates the form and calls AuthService.register().
   */
  register() {
    if (this.registerForm.valid) {
      this.authService.register(this.registerForm.value).subscribe({
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
