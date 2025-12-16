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

  first_name: {
    required: 'First name is required.',
    minlength: 'First name must be at least 3 characters.',
  },

  last_name: {
    required: 'Last name is required.',
    minlength: 'Last name must be at least 3 characters.',
  },

  username: {
    required: 'Username is required.',
    minlength: 'Username must be at least 3 characters.',
  }
};

export const AUTH_MESSAGES = {
  SUCCESS_MESSAGE: {
    login: 'Login successful.',
    register: 'Registration successful.',
    logout: 'Logout successful.',
    refresh: 'Token refreshed successfully.',
    forgotPassword: 'Password reset link sent to your email.',
    resetPassword: 'Password reset successfully.'
  },
  ERROR_MESSAGE: {
    400: 'Bad request. Please check your input.',
    401: 'Unauthorized. Please login again.',
    403: 'Forbidden. You do not have permission.',
    404: 'Resource not found.',
    422: 'Validation error. Please check your input.',
    500: 'Internal server error. Please try again later.',
    default: (status: number, message: string) => `Error ${status}: ${message}`
  }
};
