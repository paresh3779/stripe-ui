/**
 * Subscription PaymentIntent messages and validation constants
 */
export const SUBSCRIPTION_PAYMENT_INTENT_MESSAGES = {
  // Success messages
  SUBSCRIPTION_CREATED: 'Subscription created successfully',
  PAYMENT_CONFIRMED: 'Payment confirmed successfully',
  TRIAL_STARTED: 'Trial period started successfully',
  PROMO_CODE_VALID: 'Promo code is valid and applied',
  COUPON_VALID: 'Coupon is valid and applied',

  // Error messages
  PRODUCT_LOAD_FAILED: 'Failed to load subscription products',
  SUBSCRIPTION_FAILED: 'Failed to create subscription',
  PAYMENT_FAILED: 'Payment failed',
  PROMO_CODE_INVALID: 'Invalid promo code',
  COUPON_INVALID: 'Invalid coupon',
  PRICE_REQUIRED: 'Please select a subscription plan',
  PAYMENT_METHOD_REQUIRED: 'Please add a payment method',

  // UI labels
  MONTHLY_BILLING: 'Monthly',
  YEARLY_BILLING: 'Yearly',
  FREE_TRIAL: 'Free Trial',
  SELECT_PLAN: 'Select Plan',
  SUBSCRIBE_NOW: 'Subscribe Now',
  START_TRIAL: 'Start Free Trial',
  APPLY_COUPON: 'Apply Coupon',
  APPLY_PROMO: 'Apply Promo Code',
  PROCESSING: 'Processing...',
  ENTER_CARD: 'Enter Card Details',
  PAY_NOW: 'Pay Now',
  PER_MONTH: '/month',
  PER_YEAR: '/year',
} as const;
