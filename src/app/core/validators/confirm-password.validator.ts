import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validates that confirmPassword matches password field.
 * Returns { mismatch: true } if passwords don't match.
 */
export function confirmPasswordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    const confirmPassword = control.value;

    if (!confirmPassword) {
      return null;
    }

    return password === confirmPassword ? null : { mismatch: true };
  };
}
