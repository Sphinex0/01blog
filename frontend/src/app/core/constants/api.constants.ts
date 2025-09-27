export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    FORGOT_PASSWORD: '/auth/forgot-password',
  },
  USERS: {
    PROFILE: '/users/profile',
    UPDATE_PROFILE: '/users/profile',
    FOLLOW: '/users/follow',
    UNFOLLOW: '/users/unfollow',
    FOLLOWERS: '/users/followers',
    FOLLOWING: '/users/following',
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
  },
  COMMENTS: {
    CREATE: '/comments',
    GET_BY_POST: '/comments/post',
    UPDATE: '/comments',
    DELETE: '/comments',
  },
  NOTIFICATIONS: {
    GET_ALL: '/notifications',
    MARK_AS_READ: '/notifications/read',
    MARK_ALL_AS_READ: '/notifications/read-all',
  },
  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    RESOLVE: '/reports/resolve',
  },
  ADMIN: {
    USERS: '/admin/users',
    POSTS: '/admin/posts',
    REPORTS: '/admin/reports',
    ANALYTICS: '/admin/analytics',
    BAN_USER: '/admin/users/ban',
    DELETE_POST: '/admin/posts/delete',
  },
} as const;

export const HTTP_STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;
