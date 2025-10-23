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
    FOLLOW: '/users/subscribe',
    UNFOLLOW: '/users/unsubscribe', // FIX typo
    FOLLOWERS: '/users/subscribers',
    FOLLOWING: '/users/subscribtions', // FIX typo
    BY_USERNAME: '/users/username',
    SEARCH: '/users/search', // ADD THIS
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
    DELETE: '/comments',
    LIKE: '/comments/like',
    UNLIKE: '/comments/unlike', // ADD THIS
    REPLIES: '/comments/replies',
  },
  NOTIFICATIONS: {
    GET_ALL: '/users/notifications',
    MARK_AS_READ: '/notifications/read',
    MARK_ALL_AS_READ: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
    DELETE: '/notifications', // ADD THIS
  },
  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    GET_BY_ID: '/reports', // ADD THIS
    RESOLVE: '/reports/resolve',
    DISMISS: '/reports/dismiss',
    DELETE: '/reports', // ADD THIS
  },
  ADMIN: {
    // Analytics
    STATS: '/admin/stats', // ADD THIS
    ANALYTICS: '/admin/analytics',
    
    // Users Management
    USERS: '/admin/users',
    GET_USER: '/admin/users', // ADD THIS
    BAN_USER: '/admin/users/ban',
    UNBAN_USER: '/admin/users/unban',
    DELETE_USER: '/admin/users', // ADD THIS
    
    // Posts Management
    POSTS: '/admin/posts',
    GET_POST: '/admin/posts', // ADD THIS
    HIDE_POST: '/admin/posts/hide', // ADD THIS
    UNHIDE_POST: '/admin/posts/unhide', // ADD THIS
    DELETE_POST: '/admin/posts',
    
    // Reports Management
    REPORTS: '/admin/reports',
    RESOLVE_REPORT: '/admin/reports/resolve', // ADD THIS
    DISMISS_REPORT: '/admin/reports/dismiss', // ADD THIS
    DELETE_REPORT: '/admin/reports', // ADD THIS
  },
  MEDIA: {
    UPLOAD: '/media/upload',
    LOCAL_UPLOAD: '/media/local/upload',
    DELETE: '/media/delete',
    GET: '/media', // ADD THIS
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
  SERVICE_UNAVAILABLE: 503, // ADD THIS
} as const;