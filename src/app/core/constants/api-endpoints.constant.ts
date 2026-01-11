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
    STATUS: 'stripe/payment-intent/basic/status',
    CANCEL: 'stripe/payment-intent/basic/cancel',
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

  // Stripe Subscription Checkout
  SUBSCRIPTION_CHECKOUT: {
    SUBSCRIPTION: {
      PRODUCTS: 'stripe/subscription-checkout/subscription/products',
      PRODUCT_BY_ID: (id: string) => `stripe/subscription-checkout/subscription/products/${id}`,
      CREATE_SESSION: 'stripe/subscription-checkout/subscription/create-session',
    },
    TRIAL: {
      PRODUCTS: 'stripe/subscription-checkout/trial/products',
      PRODUCT_BY_ID: (id: string) => `stripe/subscription-checkout/trial/products/${id}`,
      TRIAL_INFO: 'stripe/subscription-checkout/trial/trial-info',
      CREATE_SESSION: 'stripe/subscription-checkout/trial/create-session',
    },
    COUPON: {
      PRODUCTS: 'stripe/subscription-checkout/coupon/products',
      PRODUCT_BY_ID: (id: string) => `stripe/subscription-checkout/coupon/products/${id}`,
      COUPONS: 'stripe/subscription-checkout/coupon/coupons',
      VALIDATE: 'stripe/subscription-checkout/coupon/validate-coupon',
      CALCULATE_DISCOUNT: 'stripe/subscription-checkout/coupon/calculate-discount',
      CREATE_SESSION: 'stripe/subscription-checkout/coupon/create-session',
    },
    PROMOCODE: {
      PRODUCTS: 'stripe/subscription-checkout/promocode/products',
      PRODUCT_BY_ID: (id: string) => `stripe/subscription-checkout/promocode/products/${id}`,
      VALIDATE: 'stripe/subscription-checkout/promocode/validate-promocode',
      CALCULATE_DISCOUNT: 'stripe/subscription-checkout/promocode/calculate-discount',
      CREATE_SESSION: 'stripe/subscription-checkout/promocode/create-session',
    },
  },
} as const;
