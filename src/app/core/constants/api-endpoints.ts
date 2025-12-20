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
    WEBHOOK: 'stripe/webhook'
  }
} as const;
