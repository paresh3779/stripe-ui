import { Component } from '@angular/core';
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
export class Login {
loginForm: FormGroup;
errorMessages = VALIDATION_MESSAGES;
formLabels = FORM_LABELS.login;
pageHeading = PAGE_HEADINGS.auth.login;
buttonLabels = BUTTON_LABELS.auth;
routeLabels = ROUTE_LABELS.auth;

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, passwordStrengthValidator()]]
    });
  }

  login() {
    if (this.loginForm.valid) {
      console.log(this.loginForm.value);
      // Call AuthService.login() here
    }
  }
}
