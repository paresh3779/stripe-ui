/**
 * Subscription checkout messages and validation constants
 */
export const SUBSCRIPTION_MESSAGES = {
  // Success messages
  CHECKOUT_SESSION_CREATED: 'Subscription checkout session created successfully',
  PROMO_CODE_VALID: 'Promo code is valid and applied',
  COUPON_VALID: 'Coupon is valid and applied',

  // Error messages
  PRODUCT_LOAD_FAILED: 'Failed to load subscription products',
  PRODUCT_NOT_FOUND: 'Subscription product not found',
  CHECKOUT_FAILED: 'Failed to create checkout session',
  PROMO_CODE_INVALID: 'Invalid promo code',
  COUPON_INVALID: 'Invalid coupon',
  PRICE_REQUIRED: 'Please select a subscription plan',
  TRIAL_NOT_AVAILABLE: 'Trial period is not available for this plan',

  // UI labels
  MONTHLY_BILLING: 'Monthly',
  YEARLY_BILLING: 'Yearly',
  TRIAL_PERIOD: 'Free Trial',
  SELECT_PLAN: 'Select Plan',
  SUBSCRIBE_NOW: 'Subscribe Now',
  START_TRIAL: 'Start Free Trial',
  APPLY_COUPON: 'Apply Coupon',
  APPLY_PROMO: 'Apply Promo Code',
  PROCESSING: 'Processing...',
  PER_MONTH: '/month',
  PER_YEAR: '/year',
  SAVE_YEARLY: 'Save with yearly billing',
} as const;

export const SUBSCRIPTION_VALIDATION = {
  PROMO_CODE_MIN_LENGTH: 3,
  PROMO_CODE_MAX_LENGTH: 50,
} as const;
