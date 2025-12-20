import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates password strength (min 8 chars, uppercase, lowercase, number, special char).
 * Returns { weakPassword: true } if validation fails.
 */
export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    if (!value) {
      return null;
    }

    // Requires: 8+ chars, uppercase, lowercase, digit, special char (@$!%*?&)
    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    return strongPasswordRegex.test(value) ? null : { weakPassword: true };
  };
}
