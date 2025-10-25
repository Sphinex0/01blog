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
    SEARCH: '/users/search', 
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
    UNLIKE: '/comments/unlike', 
    REPLIES: '/comments/replies',
  },
  NOTIFICATIONS: {
    GET_ALL: '/users/notifications',
    MARK_AS_READ: '/notifications/read',
    MARK_ALL_AS_READ: '/notifications/read-all',
    UNREAD_COUNT: '/notifications/unread-count',
    DELETE: '/notifications', 
  },
  REPORTS: {
    CREATE: '/reports',
    GET_ALL: '/reports',
    GET_BY_ID: '/reports', 
    RESOLVE: '/reports/resolve',
    DISMISS: '/reports/dismiss',
    DELETE: '/reports', 
  },
  ADMIN: {
    // Analytics
    STATS: '/admin/stats', 
    ANALYTICS: '/admin/analytics',
    
    // Users Management
    USERS: '/admin/users',
    GET_USER: '/admin/users', 
    BAN_USER: '/admin/ban',
    UNBAN_USER: '/admin/users/unban',
    DELETE_USER: '/admin/users', 
    PROMOTE_USER: '/admin/promote', 
    DEMOTE_USER: '/admin/demote', 
    
    // Posts Management
    POSTS: '/posts',
    GET_POST: '/admin/posts', 
    HIDE_POST: '/posts/hide', 
    UNHIDE_POST: '/admin/posts/unhide', 
    DELETE_POST: '/posts',
    
    // Reports Management
    REPORTS: '/admin/reports',
    RESOLVE_REPORT: '/admin/reports/resolve', 
    DISMISS_REPORT: '/admin/reports/dismiss', 
    DELETE_REPORT: '/admin/reports', 
  },
  MEDIA: {
    UPLOAD: '/media/upload',
    LOCAL_UPLOAD: '/media/local/upload',
    DELETE: '/media/delete',
    GET: '/media', 
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
  SERVICE_UNAVAILABLE: 503, 
} as const;