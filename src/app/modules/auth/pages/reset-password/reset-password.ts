import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { passwordStrengthValidator } from '@core/validators/password-strength.validator';
import { confirmPasswordValidator } from '@core/validators/confirm-password.validator';
import { VALIDATION_MESSAGES } from '@core/constants/validation-messages';
import { FORM_LABELS } from '@core/constants/form-labels';
import { PAGE_HEADINGS } from '@core/constants/page-headings';
import { BUTTON_LABELS } from '@core/constants/button-labels';

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
export class ResetPassword {
 resetForm: FormGroup;
  token: string = '';
  errorMessages = VALIDATION_MESSAGES;
  formLabels = FORM_LABELS.resetPassword;
  pageHeading = PAGE_HEADINGS.auth.resetPassword;
  buttonLabels = BUTTON_LABELS.auth;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute
  ) {
    this.token = this.route.snapshot.paramMap.get('token') || '';

    this.resetForm = this.fb.group({
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]]
    });
  }

  resetPassword() {
    if (this.resetForm.invalid) return;

    const payload = {
      token: this.token,
      password: this.resetForm.get('password')?.value,
      confirmPassword: this.resetForm.get('confirmPassword')?.value
    };

    console.log('Password reset payload:', payload);

    // Call AuthService.resetPassword(payload)
  }
}
