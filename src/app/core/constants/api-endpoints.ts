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
  }
} as const;
