/**
 * API Endpoints Constants
 * Centralized location for all API endpoint paths
 */
export const API_ENDPOINTS = {
  // Stripe PaymentIntent - Basic
  PAYMENT_INTENT_BASIC: {
    PRODUCTS: 'stripe/payment-intent/basic/products',
    PRODUCT_BY_ID: (id: string) => `stripe/payment-intent/basic/products/${id}`,
    CREATE: 'stripe/payment-intent/basic/create',
    CONFIRM: 'stripe/payment-intent/basic/confirm',
  },

  // Stripe PaymentIntent - PromoCode
  PAYMENT_INTENT_PROMOCODE: {
    PRODUCTS: 'stripe/payment-intent/promocode/products',
    PRODUCT_BY_ID: (id: string) => `stripe/payment-intent/promocode/products/${id}`,
    VALIDATE: 'stripe/payment-intent/promocode/validate-promocode',
    CREATE: 'stripe/payment-intent/promocode/create',
    CONFIRM: 'stripe/payment-intent/promocode/confirm',
  },

  // Stripe PaymentIntent - Coupon
  PAYMENT_INTENT_COUPON: {
    PRODUCTS: 'stripe/payment-intent/coupon/products',
    PRODUCT_BY_ID: (id: string) => `stripe/payment-intent/coupon/products/${id}`,
    COUPONS: 'stripe/payment-intent/coupon/coupons',
    VALIDATE: 'stripe/payment-intent/coupon/validate-coupon',
    CREATE: 'stripe/payment-intent/coupon/create',
    CONFIRM: 'stripe/payment-intent/coupon/confirm',
  },

  // Stripe Checkout (existing)
  CHECKOUT_BASIC: {
    PRODUCTS: 'stripe/checkout/basic/products',
    PRODUCT_BY_ID: (id: string) => `stripe/checkout/basic/products/${id}`,
    CREATE_SESSION: 'stripe/checkout/basic/create-session',
  },

  CHECKOUT_PROMOCODE: {
    PRODUCTS: 'stripe/checkout/promocode/products',
    PRODUCT_BY_ID: (id: string) => `stripe/checkout/promocode/products/${id}`,
    VALIDATE: 'stripe/checkout/promocode/validate-promocode',
    CREATE_SESSION: 'stripe/checkout/promocode/create-session',
  },

  CHECKOUT_COUPON: {
    PRODUCTS: 'stripe/checkout/coupon/products',
    PRODUCT_BY_ID: (id: string) => `stripe/checkout/coupon/products/${id}`,
    COUPONS: 'stripe/checkout/coupon/coupons',
    CREATE_SESSION: 'stripe/checkout/coupon/create-session',
  },
} as const;
