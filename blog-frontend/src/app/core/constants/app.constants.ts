export const APP_CONSTANTS = {
  APP_NAME: '01Blog',
  VERSION: '1.0.0',
  STORAGE_KEYS: {
    ACCESS_TOKEN: 'blog_access_token',
    REFRESH_TOKEN: 'blog_refresh_token',
    USER_DATA: 'blog_user_data',
    THEME: 'blog_app_theme',
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    POSTS_PER_PAGE: 12, // ADD THIS
    USERS_PER_PAGE: 10, // ADD THIS
    REPORTS_PER_PAGE: 10, // ADD THIS
  },
  MEDIA: {
    MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/webm', 'video/ogg'],
    ALLOWED_IMAGE_EXTENSIONS: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    ALLOWED_VIDEO_EXTENSIONS: ['mp4', 'webm', 'ogg'],
  },
  VALIDATION: {
    MIN_PASSWORD_LENGTH: 8,
    MAX_PASSWORD_LENGTH: 100,
    MAX_POST_TITLE_LENGTH: 200, // ADD THIS
    MAX_POST_LENGTH: 2000,
    MAX_COMMENT_LENGTH: 500,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    MAX_FULLNAME_LENGTH: 100,
    MAX_BIO_LENGTH: 500,
    MAX_REPORT_REASON_LENGTH: 500, // ADD THIS
  },
  NOTIFICATION_TYPES: { // ADD THIS
    LIKE: 'LIKE',
    COMMENT: 'COMMENT',
    FOLLOW: 'FOLLOW',
    NEW_POST: 'NEW_POST',
  },
  REPORT_STATUS: { // ADD THIS
    PENDING: 'PENDING',
    RESOLVED: 'RESOLVED',
    DISMISSED: 'DISMISSED',
  },
} as const;

export const ROUTES = {
  AUTH: {
    BASE: '/auth',
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  HOME: '/',
  PROFILE: {
    BASE: '/users/profile', // CHANGE from '/profile'
    ME: '/users/profile/me',
    EDIT: '/users/profile/edit',
    VIEW: '/users/profile',
    FOLLOWERS: '/users/profile/:username/followers', // ADD THIS
    FOLLOWING: '/users/profile/:username/following', // ADD THIS
  },
  POSTS: {
    BASE: '/posts',
    CREATE: '/posts/create',
    EDIT: '/posts/edit',
    DETAIL: '/posts',
  },
  USERS: { // ADD THIS
    BASE: '/users',
    DISCOVER: '/users',
  },
  NOTIFICATIONS: '/notifications',
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin',
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
  },
  SETTINGS: '/settings',
} as const;

export const THEMES = {
  LIGHT: 'light-theme',
  DARK: 'dark-theme',
  AUTO: 'auto',
} as const;

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid file.',
  USER_NOT_FOUND: 'User not found.',
  POST_NOT_FOUND: 'Post not found.',
  COMMENT_NOT_FOUND: 'Comment not found.',
  ALREADY_FOLLOWING: 'You are already following this user.',
  NOT_FOLLOWING: 'You are not following this user.',
  CANNOT_FOLLOW_SELF: 'You cannot follow yourself.',
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const SUCCESS_MESSAGES = { // ADD THIS
  USER_BANNED: 'User banned successfully',
  USER_UNBANNED: 'User unbanned successfully',
  USER_DELETED: 'User deleted successfully',
  POST_HIDDEN: 'Post hidden successfully',
  POST_UNHIDDEN: 'Post unhidden successfully',
  POST_DELETED: 'Post deleted successfully',
  REPORT_RESOLVED: 'Report resolved successfully',
  REPORT_DISMISSED: 'Report dismissed successfully',
  REPORT_DELETED: 'Report deleted successfully',
  PROFILE_UPDATED: 'Profile updated successfully',
  POST_CREATED: 'Post created successfully',
  POST_UPDATED: 'Post updated successfully',
  COMMENT_CREATED: 'Comment created successfully',
  COMMENT_DELETED: 'Comment deleted successfully',
  USER_PROMOTED: 'User promoted to Admin successfully', 
  USER_DEMOTED: 'User demoted to regular User successfully', 
} as const;