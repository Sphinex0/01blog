export const API_BASE_URL = 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    FOLLOW: '/users/subscribe', // '/users/follow',
    UNFOLLOW: '/users/unfollow',
    FOLLOWERS: '/users/subscribers',
    FOLLOWING: '/users/subscribtions',
    BY_USERNAME: '/users/username',
  },
  POSTS: {
    CREATE: '/posts',
    GET_ALL: '/posts',
    GET_BY_ID: '/posts',
    UPDATE: '/posts',
    DELETE: '/posts',
    LIKE: '/posts/like',
    UNLIKE: '/posts/unlike',
    FEED: '/posts/feed',
    BY_USER: '/posts/user',
  },
  COMMENTS: {
    CREATE: '/comments',
    GET_BY_POST: '/comments/post',
    UPDATE: '/comments',
    DELETE: '/posts/comments',
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    MARK_AS_READ: '/notifications/read',
    MARK_ALL_AS_READ: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
  },
  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    RESOLVE: '/reports/resolve',
    DISMISS: '/reports/dismiss',
  },
  ADMIN: {
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
    BAN_USER: '/admin/users/ban',
    UNBAN_USER: '/admin/users/unban',
    DELETE_POST: '/admin/posts/delete',
  },
  MEDIA: {
    UPLOAD: '/media/upload',
    DELETE: '/media/delete',
  }
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
