import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { confirmPasswordValidator } from '@core/validators/confirm-password.validator';
import { VALIDATION_MESSAGES } from '@core/constants/validation-messages';
import { FORM_LABELS } from '@core/constants/form-labels';
import { PAGE_HEADINGS } from '@core/constants/page-headings';
import { BUTTON_LABELS } from '@core/constants/button-labels';
import { AuthService } from '@core/services/auth.service';

/**
 * ResetPassword component handles password reset functionality.
 * It provides a form for new password input and calls the AuthService for password reset.
 */
@Component({
  selector: 'app-reset-password',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    RouterModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.scss',
})
export class ResetPassword implements OnInit {
 resetForm!: FormGroup;
  token: string = '';
  errorMessages = VALIDATION_MESSAGES;
  formLabels = FORM_LABELS.resetPassword;
  pageHeading = PAGE_HEADINGS.auth.resetPassword;
  buttonLabels = BUTTON_LABELS.auth;
  errorMessage: string = '';

  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  private router = inject(Router);

  ngOnInit() {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]]
    });
  }

  /**
   * Handles the reset password form submission.
   * Validates the form and calls AuthService.resetPassword().
   */
  resetPassword() {
    if (this.resetForm.invalid) return;

    const payload = {
      token: this.token,
      password: this.resetForm.get('password')?.value,
      confirmPassword: this.resetForm.get('confirmPassword')?.value
    };

    this.authService.resetPassword(payload).subscribe({
      next: () => {
        this.router.navigate(['/auth/login']); // Navigate to login on success
      },
      error: (error) => {
        this.errorMessage = error;
      }
    });
  }
}
