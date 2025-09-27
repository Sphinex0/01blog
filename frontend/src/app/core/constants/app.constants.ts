export const APP_CONSTANTS = {
  APP_NAME: '01Blog',
  VERSION: '1.0.0',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'access_token',
    REFRESH_TOKEN: 'refresh_token',
    USER_DATA: 'user_data',
    THEME: 'app_theme',
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  MEDIA: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_POST_LENGTH: 2000,
    MAX_COMMENT_LENGTH: 500,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
  },
} as const;

export const ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  HOME: '/',
  PROFILE: '/profile',
  POSTS: {
    CREATE: '/posts/create',
    EDIT: '/posts/edit',
    DETAIL: '/posts',
  },
  NOTIFICATIONS: '/notifications',
  ADMIN: {
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    REPORTS: '/admin/reports',
  },
  SETTINGS: '/settings',
} as const;
