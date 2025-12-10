export const VALIDATION_MESSAGES: any = {
  email: {
    required: 'Email is required.',
    email: 'Enter a valid email address.',
  },

  password: {
    required: 'Password is required.',
    minlength: 'Password must be at least 6 characters.',
    weakPassword: 'Password must contain at least 8 characters, including uppercase, lowercase, number, and special character.'
  },

  confirmPassword: {
    required: 'Confirm Password is required.',
    mismatch: 'Passwords do not match.',
  },

  username: {
    required: 'Username is required.',
    minlength: 'Username must be at least 3 characters.',
  }
};
