import { Component } from '@angular/core';
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
  registerForm: FormGroup;
  errorMessages = VALIDATION_MESSAGES;
  formLabels = FORM_LABELS.register;
  pageHeading = PAGE_HEADINGS.auth.register;
  buttonLabels = BUTTON_LABELS.auth;
  routeLabels = ROUTE_LABELS.auth;

  constructor(private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]],
      confirmPassword: ['', [Validators.required, confirmPasswordValidator()]]
    });
  }

  register() {
    if (this.registerForm.valid) {
      console.log(this.registerForm.value);
      // Call AuthService.register() here
    }
  }

}
