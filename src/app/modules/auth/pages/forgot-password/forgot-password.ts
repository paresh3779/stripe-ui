import { Component } from '@angular/core';
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
forgotForm: FormGroup;
errorMessages = VALIDATION_MESSAGES;
formLabels = FORM_LABELS.forgotPassword;
pageHeading = PAGE_HEADINGS.auth.forgotPassword;
buttonLabels = BUTTON_LABELS.auth;
routeLabels = ROUTE_LABELS.auth;

  constructor(private fb: FormBuilder) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.forgotForm.valid) {
      console.log(this.forgotForm.value);
      // Call AuthService.forgotPassword() here
    }
  }
}
