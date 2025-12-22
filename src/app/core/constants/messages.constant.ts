/**
 * Application Messages Constants
 * Centralized location for all user-facing messages
 */
export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    PAYMENT_FORM_READY: 'Payment form ready',
    PAYMENT_SUCCESSFUL: 'Payment successful!',
    PROMO_CODE_APPLIED: 'Promo code applied successfully!',
    COUPON_APPLIED: 'Coupon applied successfully!',
    PROMO_CODE_VALID: 'Promo code is valid',
    COUPON_VALID: 'Coupon is valid',
  },

  // Error Messages - General
  ERROR: {
    GENERIC: 'An error occurred. Please try again.',
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
  },

  // Error Messages - Products
  PRODUCT: {
    NOT_FOUND: 'Product not found',
    LOAD_FAILED: 'Failed to load products',
    NOT_AVAILABLE: 'Product is not available',
  },

  // Error Messages - Prices
  PRICE: {
    NOT_FOUND: 'Price not found',
    NOT_ACTIVE: 'This price is not active',
    NOT_ONE_TIME: 'This price is not for one-time payment',
  },

  // Error Messages - Promo Codes
  PROMO_CODE: {
    INVALID: 'Invalid promo code',
    REQUIRED: 'Please enter a promo code',
    VALIDATE_FIRST: 'Please validate promo code first',
    VALIDATION_FAILED: 'Promo code validation failed',
    NOT_ACTIVE: 'Promo code is not active',
    EXPIRED: 'Promo code has expired',
    MAX_REDEMPTIONS: 'Promo code has reached maximum redemptions',
  },

  // Error Messages - Coupons
  COUPON: {
    INVALID: 'Invalid coupon',
    REQUIRED: 'Please select a coupon',
    VALIDATE_FIRST: 'Please select and validate coupon first',
    VALIDATION_FAILED: 'Coupon validation failed',
    NOT_ACTIVE: 'Coupon is not active',
    EXPIRED: 'Coupon has expired',
    MAX_REDEMPTIONS: 'Coupon has reached maximum redemptions',
    LOAD_FAILED: 'Failed to load coupons',
  },

  // Error Messages - Payment
  PAYMENT: {
    CREATION_FAILED: 'Failed to create payment intent',
    CONFIRMATION_FAILED: 'Payment confirmation failed',
    FAILED: 'Payment failed',
    SYSTEM_NOT_READY: 'Payment system not ready',
    STRIPE_NOT_INITIALIZED: 'Stripe not initialized',
    INITIALIZATION_FAILED: 'Failed to initialize payment system',
  },

  // Loading Messages
  LOADING: {
    PRODUCTS: 'Loading products...',
    PAYMENT: 'Processing payment...',
    VALIDATING: 'Validating...',
  },

  // Info Messages
  INFO: {
    SELECT_PRODUCT: 'Select a product to continue',
    SELECT_PRICE: 'Select a product and price to continue',
    NO_PRODUCTS: 'No products available',
    NO_COUPONS: 'No coupons available',
  },
} as const;
