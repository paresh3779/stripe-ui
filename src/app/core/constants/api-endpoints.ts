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
        CREATE_SESSION: 'stripe/subscription-checkout/subscription/create-session',
        // Subscription Management
        SUBSCRIPTIONS: 'stripe/subscription-checkout/subscription/subscriptions',
        SUBSCRIPTION: (id: string) => `stripe/subscription-checkout/subscription/subscriptions/${id}`,
        CANCEL: (id: string) => `stripe/subscription-checkout/subscription/subscriptions/${id}/cancel`,
        // Invoice Management
        INVOICES: 'stripe/subscription-checkout/subscription/invoices',
        INVOICE: (id: string) => `stripe/subscription-checkout/subscription/invoices/${id}`,
        DOWNLOAD_INVOICE: (id: string) => `stripe/subscription-checkout/subscription/invoices/${id}/download`
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
    SUBSCRIPTION_PAYMENT_INTENT: {
      SUBSCRIPTION: {
        PRODUCTS: 'stripe/subscription-payment-intent/subscription/products',
        PRODUCT: (id: string) => `stripe/subscription-payment-intent/subscription/products/${id}`,
        SETUP_INTENT: 'stripe/subscription-payment-intent/subscription/setup-intent',
        CREATE: 'stripe/subscription-payment-intent/subscription/create',
        CONFIRM: 'stripe/subscription-payment-intent/subscription/confirm'
      },
      TRIAL: {
        PRODUCTS: 'stripe/subscription-payment-intent/trial/products',
        PRODUCT: (id: string) => `stripe/subscription-payment-intent/trial/products/${id}`,
        TRIAL_INFO: 'stripe/subscription-payment-intent/trial/trial-info',
        SETUP_INTENT: 'stripe/subscription-payment-intent/trial/setup-intent',
        CREATE: 'stripe/subscription-payment-intent/trial/create',
        CREATE_WITH_SAVED: 'stripe/subscription-payment-intent/trial/create-with-saved',
        CONFIRM: 'stripe/subscription-payment-intent/trial/confirm',
        // Payment Methods
        PAYMENT_METHODS: 'stripe/subscription-payment-intent/trial/payment-methods',
        DELETE_PAYMENT_METHOD: (id: string) => `stripe/subscription-payment-intent/trial/payment-methods/${id}`,
        // Subscription Management
        SUBSCRIPTIONS: 'stripe/subscription-payment-intent/trial/subscriptions',
        SUBSCRIPTION: (id: string) => `stripe/subscription-payment-intent/trial/subscriptions/${id}`,
        CANCEL_SUBSCRIPTION: (id: string) => `stripe/subscription-payment-intent/trial/subscriptions/${id}/cancel`,
        // Invoice Management
        INVOICES: 'stripe/subscription-payment-intent/trial/invoices',
        INVOICE: (id: string) => `stripe/subscription-payment-intent/trial/invoices/${id}`,
        DOWNLOAD_INVOICE: (id: string) => `stripe/subscription-payment-intent/trial/invoices/${id}/download`
      },
      // Centralized Invoice Management
      INVOICES: {
        LIST: 'stripe/invoices',
        STATISTICS: 'stripe/invoices/statistics',
        SYNC: 'stripe/invoices/sync',
        GET: (id: string) => `stripe/invoices/${id}`,
        DOWNLOAD: (id: string) => `stripe/invoices/${id}/download`,
        VIEW_ON_STRIPE: (id: string) => `stripe/invoices/${id}/view-on-stripe`,
        PRINT: (id: string) => `stripe/invoices/${id}/print`,
        RESEND_EMAIL: (id: string) => `stripe/invoices/${id}/resend-email`
      },
      COUPON: {
        PRODUCTS: 'stripe/subscription-payment-intent/coupon/products',
        PRODUCT: (id: string) => `stripe/subscription-payment-intent/coupon/products/${id}`,
        COUPONS: 'stripe/subscription-payment-intent/coupon/coupons',
        VALIDATE: 'stripe/subscription-payment-intent/coupon/validate-coupon',
        CALCULATE_DISCOUNT: 'stripe/subscription-payment-intent/coupon/calculate-discount',
        SETUP_INTENT: 'stripe/subscription-payment-intent/coupon/setup-intent',
        CREATE: 'stripe/subscription-payment-intent/coupon/create',
        CONFIRM: 'stripe/subscription-payment-intent/coupon/confirm'
      },
      PROMOCODE: {
        PRODUCTS: 'stripe/subscription-payment-intent/promocode/products',
        PRODUCT: (id: string) => `stripe/subscription-payment-intent/promocode/products/${id}`,
        VALIDATE: 'stripe/subscription-payment-intent/promocode/validate-promocode',
        CALCULATE_DISCOUNT: 'stripe/subscription-payment-intent/promocode/calculate-discount',
        SETUP_INTENT: 'stripe/subscription-payment-intent/promocode/setup-intent',
        CREATE: 'stripe/subscription-payment-intent/promocode/create',
        CONFIRM: 'stripe/subscription-payment-intent/promocode/confirm'
      }
    },
    WEBHOOK: 'stripe/webhook'
  }
} as const;
