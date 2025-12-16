import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { RouterModule } from '@angular/router';
import { VALIDATION_MESSAGES } from '@core/constants/validation-messages';
import { FORM_LABELS } from '@core/constants/form-labels';
import { PAGE_HEADINGS } from '@core/constants/page-headings';
import { BUTTON_LABELS } from '@core/constants/button-labels';
import { ROUTE_LABELS } from '@core/constants/button-labels';
import { AuthService } from '@core/services/auth.service';

/**
 * ForgotPassword component handles forgot password functionality.
 * It provides a form for email input and calls the AuthService for password reset request.
 */
@Component({
  selector: 'app-forgot-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss',
})
export class ForgotPassword {
  forgotForm!: FormGroup;
  errorMessages = VALIDATION_MESSAGES;
  formLabels = FORM_LABELS.forgotPassword;
  pageHeading = PAGE_HEADINGS.auth.forgotPassword;
  buttonLabels = BUTTON_LABELS.auth;
  routeLabels = ROUTE_LABELS.auth;

  private errorMessage: string = '';
  private successMessage: string = '';

  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  /**
   * Initializes the forgot password form.
   * Creates a form group with an email field and sets up form validation.
   */
  ngOnInit() {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  /**
   * Handles the forgot password form submission.
   * Validates the form and calls AuthService.forgotPassword().
   */
  sendResetLink() {
    if (this.forgotForm.valid) {
      this.authService.forgotPassword(this.forgotForm.value).subscribe({
        next: () => {
          this.successMessage = 'Password reset link sent to your email.';
        },
        error: (error) => {
          this.errorMessage = error;
        }
      });
    }
  }
}
