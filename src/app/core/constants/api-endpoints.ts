export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: 'login',
    REGISTER: 'register',
    LOGOUT: 'logout',
    REFRESH: 'refresh',
    FORGOT_PASSWORD: 'forgot-password',
    RESET_PASSWORD: 'reset-password',
    PROFILE: 'user'
  },
  USERS: {
    BASE: 'users',
    PROFILE: 'users/profile',
    CHANGE_PASSWORD: 'users/change-password',
    GET_USERS: 'users',
    GET_USER: (id: string) => `users/${id}`,
    UPDATE_USER: (id: string) => `users/${id}`,
    DELETE_USER: (id: string) => `users/${id}`,
    UPLOAD_AVATAR: 'users/avatar',
    DELETE_AVATAR: 'users/avatar'
  },
  STRIPE: {
    CHECKOUT: {
      BASIC: {
        PRODUCTS: 'stripe/checkout/basic/products',
        PRODUCT: (id: string) => `stripe/checkout/basic/products/${id}`,
        CREATE_SESSION: 'stripe/checkout/basic/create-session'
      },
      PROMOCODE: {
        PRODUCTS: 'stripe/checkout/promocode/products',
        PRODUCT: (id: string) => `stripe/checkout/promocode/products/${id}`,
        VALIDATE: 'stripe/checkout/promocode/validate-promocode',
        CREATE_SESSION: 'stripe/checkout/promocode/create-session'
      },
      COUPON: {
        PRODUCTS: 'stripe/checkout/coupon/products',
        PRODUCT: (id: string) => `stripe/checkout/coupon/products/${id}`,
        COUPONS: 'stripe/checkout/coupon/coupons',
        CREATE_SESSION: 'stripe/checkout/coupon/create-session'
      }
    },
    SUBSCRIPTION_CHECKOUT: {
      SUBSCRIPTION: {
        PRODUCTS: 'stripe/subscription-checkout/subscription/products',
        PRODUCT: (id: string) => `stripe/subscription-checkout/subscription/products/${id}`,
        CREATE_SESSION: 'stripe/subscription-checkout/subscription/create-session'
      },
      TRIAL: {
        PRODUCTS: 'stripe/subscription-checkout/trial/products',
        PRODUCT: (id: string) => `stripe/subscription-checkout/trial/products/${id}`,
        TRIAL_INFO: 'stripe/subscription-checkout/trial/trial-info',
        CREATE_SESSION: 'stripe/subscription-checkout/trial/create-session'
      },
      COUPON: {
        PRODUCTS: 'stripe/subscription-checkout/coupon/products',
        PRODUCT: (id: string) => `stripe/subscription-checkout/coupon/products/${id}`,
        COUPONS: 'stripe/subscription-checkout/coupon/coupons',
        VALIDATE: 'stripe/subscription-checkout/coupon/validate-coupon',
        CALCULATE_DISCOUNT: 'stripe/subscription-checkout/coupon/calculate-discount',
        CREATE_SESSION: 'stripe/subscription-checkout/coupon/create-session'
      },
      PROMOCODE: {
        PRODUCTS: 'stripe/subscription-checkout/promocode/products',
        PRODUCT: (id: string) => `stripe/subscription-checkout/promocode/products/${id}`,
        VALIDATE: 'stripe/subscription-checkout/promocode/validate-promocode',
        CALCULATE_DISCOUNT: 'stripe/subscription-checkout/promocode/calculate-discount',
        CREATE_SESSION: 'stripe/subscription-checkout/promocode/create-session'
      }
    },
    WEBHOOK: 'stripe/webhook'
  }
} as const;
