# Create Interface files
echo -e "${YELLOW}📋 Creating interface files...${NC}"
cat > src/app/core/models/user.interface.ts << 'EOF'
export interface User {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
  isAdmin: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isFollowing?: boolean;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatar?: string;
}
EOF

cat > src/app/core/models/post.interface.ts << 'EOF'
export interface Post {
  id: number;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  author: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  title: string;
  content: string;
  media?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  media?: File;
}

import { User } from './user.interface';
EOF

cat > src/app/core/models/comment.interface.ts << 'EOF'
export interface Comment {
  id: number;
  content: string;
  author: User;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
}

import { User } from './user.interface';
EOF

cat > src/app/core/models/notification.interface.ts << 'EOF'
export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'new_post';
  message: string;
  userId: number;
  relatedUserId?: number;
  relatedPostId?: number;
  isRead: boolean;
  createdAt: Date;
}
EOF

cat > src/app/core/models/report.interface.ts << 'EOF'
export interface Report {
  id: number;
  reportedUserId: number;
  reportedUser: User;
  reporterId: number;
  reporter: User;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface CreateReportRequest {
  reportedUserId: number;
  reason: string;
}

import { User } from './user.interface';
EOF

cat > src/app/core/models/api-response.interface.ts << 'EOF'
export interface ApiResponse<T = any> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
}
EOF

# Create Constants files
echo -e "${YELLOW}📝 Creating constants files...${NC}"
cat > src/app/core/constants/api.constants.ts << 'EOF'
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
EOF

cat > src/app/core/constants/app.constants.ts << 'EOF'
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
EOF

# Create Environment files
echo -e "${YELLOW}🌐 Creating environment files...${NC}"
cat > src/environments/environment.ts << 'EOF'
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/api',
  appName: '01Blog',
  version: '1.0.0-dev',
  features: {
    enableAnalytics: false,
    enableWebSockets: true,
    enablePWA: true,
  }
};
EOF

cat > src/environments/environment.prod.ts << 'EOF'
export const environment = {
  production: true,
  apiUrl: 'https://api.01blog.com/api',
  appName: '01Blog',
  version: '1.0.0',
  features: {
    enableAnalytics: true,
    enableWebSockets: true,
    enablePWA: true,
  }
};
EOF

# Create SCSS files
echo -e "${YELLOW}🎨 Creating SCSS files...${NC}"
cat > src/assets/styles/_variables.scss << 'EOF'
// Colors
:root {
  // Primary colors
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-primary-light: #66b3ff;
  
  // Secondary colors
  --color-secondary: #6c757d;
  --color-secondary-dark: #495057;
  --color-secondary-light: #adb5bd;
  
  // Status colors
  --color-success: #28a745;
  --color-danger: #dc3545;
  --color-warning: #ffc107;
  --color-info: #17a2b8;
  
  // Neutral colors
  --color-white: #ffffff;
  --color-black: #000000;
  --color-gray-100: #f8f9fa;
  --color-gray-200: #e9ecef;
  --color-gray-300: #dee2e6;
  --color-gray-400: #ced4da;
  --color-gray-500: #adb5bd;
  --color-gray-600: #6c757d;
  --color-gray-700: #495057;
  --color-gray-800: #343a40;
  --color-gray-900: #212529;
  
  // Dark theme colors
  --color-dark-bg: #121212;
  --color-dark-surface: #1e1e1e;
  --color-dark-text: #ffffff;
  --color-dark-text-secondary: #aaaaaa;
}

// Typography
$font-family-base: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
$font-family-mono: SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace;

$font-size-base: 1rem;
$font-size-sm: 0.875rem;
$font-size-lg: 1.25rem;
$font-size-xl: 1.5rem;
$font-size-xxl: 2rem;

$font-weight-light: 300;
$font-weight-normal: 400;
$font-weight-medium: 500;
$font-weight-semibold: 600;
$font-weight-bold: 700;

$line-height-base: 1.5;
$line-height-sm: 1.25;
$line-height-lg: 1.75;

// Spacing
$spacer: 1rem;
$spacers: (
  0: 0,
  1: $spacer * 0.25,
  2: $spacer * 0.5,
  3: $spacer,
  4: $spacer * 1.5,
  5: $spacer * 3
);

// Breakpoints
$grid-breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1400px
);

// Border radius
$border-radius: 0.375rem;
$border-radius-sm: 0.25rem;
$border-radius-lg: 0.5rem;
$border-radius-xl: 1rem;
$border-radius-pill: 50rem;

// Shadows
$box-shadow-sm: 0 0.125rem 0.25rem rgba(0, 0, 0, 0.075);
$box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
$box-shadow-lg: 0 1rem 3rem rgba(0, 0, 0, 0.175);

// Transitions
$transition-base: all 0.3s ease;
$transition-fast: all 0.15s ease;
$transition-slow: all 0.6s ease;

// Z-index
$z-index-dropdown: 1000;
$z-index-sticky: 1020;
$z-index-fixed: 1030;
$z-index-modal-backdrop: 1040;
$z-index-modal: 1050;
$z-index-popover: 1060;
$z-index-tooltip: 1070;
EOF

cat > src/assets/styles/_mixins.scss << 'EOF'
// Media query mixins
@mixin media-breakpoint-up($name) {
  $min: map-get($grid-breakpoints, $name);
  @if $min != 0 {
    @media (min-width: $min) {
      @content;
    }
  } @else {
    @content;
  }
}

@mixin media-breakpoint-down($name) {
  $max: map-get($grid-breakpoints, $name) - 0.02;
  @media (max-width: $max) {
    @content;
  }
}

// Flexbox mixins
@mixin flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

@mixin flex-between {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

@mixin flex-column {
  display: flex;
  flex-direction: column;
}

// Button mixins
@mixin button-variant($color, $background, $border) {
  color: $color;
  background-color: $background;
  border-color: $border;

  &:hover {
    color: $color;
    background-color: darken($background, 7.5%);
    border-color: darken($border, 10%);
  }

  &:focus {
    box-shadow: 0 0 0 0.2rem rgba($border, 0.5);
  }

  &:active {
    color: $color;
    background-color: darken($background, 10%);
    border-color: darken($border, 12.5%);
  }

  &:disabled {
    color: $color;
    background-color: $background;
    border-color: $border;
    opacity: 0.65;
  }
}

// Card mixins
@mixin card-shadow($level: 1) {
  @if $level == 1 {
    box-shadow: $box-shadow-sm;
  } @else if $level == 2 {
    box-shadow: $box-shadow;
  } @else if $level == 3 {
    box-shadow: $box-shadow-lg;
  }
}

// Text mixins
@mixin text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

@mixin text-multiline-truncate($lines: 3) {
  display: -webkit-box;
  -webkit-line-clamp: $lines;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

// Animation mixins
@mixin fade-in($duration: 0.3s) {
  opacity: 0;
  animation: fadeIn $duration ease-in-out forwards;
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

@mixin slide-up($duration: 0.3s) {
  transform: translateY(20px);
  opacity: 0;
  animation: slideUp $duration ease-out forwards;
}

@keyframes slideUp {
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// Loading spinner mixin
@mixin loading-spinner($size: 2rem, $color: var(--color-primary)) {
  width: $size;
  height: $size;
  border: 3px solid rgba($color, 0.3);
  border-radius: 50%;
  border-top-color: $color;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
EOF

cat > src/assets/styles/_themes.scss << 'EOF'
// Light theme (default)
[data-theme="light"] {
  --bg-primary: #{var(--color-white)};
  --bg-secondary: #{var(--color-gray-100)};
  --bg-tertiary: #{var(--color-gray-200)};
  --text-primary: #{var(--color-gray-900)};
  --text-secondary: #{var(--color-gray-600)};
  --text-muted: #{var(--color-gray-500)};
  --border-color: #{var(--color-gray-300)};
  --shadow-color: rgba(0, 0, 0, 0.1);
}

// Dark theme
[data-theme="dark"] {
  --bg-primary: #{var(--color-dark-bg)};
  --bg-secondary: #{var(--color-dark-surface)};
  --bg-tertiary: #{var(--color-gray-800)};
  --text-primary: #{var(--color-dark-text)};
  --text-secondary: #{var(--color-dark-text-secondary)};
  --text-muted: #{var(--color-gray-400)};
  --border-color: #{var(--color-gray-700)};
  --shadow-color: rgba(0, 0, 0, 0.3);
}

// Theme transition
* {
  transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
}
EOF

# Create Route files
echo -e "${YELLOW}🛣️ Creating route files...${NC}"
cat > src/app/features/auth/auth.routes.ts << 'EOF'
import { Routes } from '@angular/router';
import { NoAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [NoAuthGuard],
    children: [
      {
        path: 'login',
        loadComponent: () => import('./components/login/login.component').then(c => c.LoginComponent),
        title: '01Blog - Login'
      },
      {
        path: 'register',
        loadComponent: () => import('./components/register/register.component').then(c => c.RegisterComponent),
        title: '01Blog - Register'
      },
      {
        path: 'forgot-password',
        loadComponent: () => import('./components/forgot-password/forgot-password.component').then(c => c.ForgotPasswordComponent),
        title: '01Blog - Forgot Password'
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
EOF

# Create additional route files for other features
echo -e "${YELLOW}🔗 Creating additional route files...${NC}"
touch src/app/features/home/home.routes.ts
touch src/app/features/posts/posts.routes.ts
touch src/app/features/profile/profile.routes.ts
touch src/app/features/notifications/notifications.routes.ts
touch src/app/features/admin/admin.routes.ts
touch src/app/features/settings/settings.routes.ts

# Create Validators
echo -e "${YELLOW}✅ Creating custom validators...${NC}"
cat > src/app/shared/validators/custom-validators.ts << 'EOF'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= 8;

      const valid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

      if (!valid) {
        return {
          passwordStrength: {
            hasNumber,
            hasUpper,
            hasLower,
            hasSpecial,
            isValidLength
          }
        };
      }

      return null;
    };
  }

  static usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const isValidLength = value.length >= 3 && value.length <= 50;
      const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(value);
      const startsWithLetter = /^[a-zA-Z]/.test(value);

      const valid = isValidLength && hasValidChars && startsWithLetter;

      if (!valid) {
        return {
          username: {
            isValidLength,
            hasValidChars,
            startsWithLetter
          }
        };
      }

      return null;
    };
  }

  static fileExtension(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) {
        return null;
      }

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          fileExtension: {
            actualExtension: extension,
            allowedExtensions
          }
        };
      }

      return null;
    };
  }

  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) {
        return null;
      }

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return {
          fileSize: {
            actualSize: file.size,
            maxSize: maxSizeInBytes,
            actualSizeMB: (file.size / (1024 * 1024)).toFixed(2),
            maxSizeMB: maxSizeInMB
          }
        };
      }

      return null;
    };
  }
}
EOF

cat > src/app/shared/validators/password-match.validator.ts << 'EOF'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordMatchValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordMatch: true };
    }

    return null;
  };
}
EOF

# Create mock data file
echo -e "${YELLOW}📊 Creating mock data file...${NC}"
cat > src/assets/data/mock-data.json << 'EOF'
{
  "users": [
    {
      "id": 1,
      "username": "john_doe",
      "email": "john@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "avatar": "/assets/images/placeholders/avatar-1.jpg",
      "bio": "Passionate developer learning new technologies every day.",
      "isAdmin": false,
      "isActive": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-20T14:25:00Z"
    },
    {
      "id": 2,
      "username": "jane_smith",
      "email": "jane@example.com",
      "firstName": "Jane",
      "lastName": "Smith",
      "avatar": "/assets/images/placeholders/avatar-2.jpg",
      "bio": "Full-stack developer with a love for clean code and great UX.",
      "isAdmin": true,
      "isActive": true,
      "createdAt": "2024-01-10T09:15:00Z",
      "updatedAt": "2024-01-18T16:45:00Z"
    }
  ],
  "posts": [
    {
      "id": 1,
      "title": "Getting Started with Angular Signals",
      "content": "Today I learned about Angular Signals and how they revolutionize state management...",
      "mediaUrl": "/assets/images/placeholders/post-1.jpg",
      "mediaType": "image",
      "author": {
        "id": 1,
        "username": "john_doe",
        "firstName": "John",
        "lastName": "Doe",
        "avatar": "/assets/images/placeholders/avatar-1.jpg"
      },
      "likesCount": 15,
      "commentsCount": 3,
      "isLiked": false,
      "createdAt": "2024-01-20T10:30:00Z",
      "updatedAt": "2024-01-20T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Building Scalable REST APIs with Spring Boot",
      "content": "Here's what I learned while building a scalable backend for a social platform...",
      "mediaUrl": "/assets/images/placeholders/post-2.jpg",
      "mediaType": "image",
      "author": {
        "id": 2,
        "username": "jane_smith",
        "firstName": "Jane",
        "lastName": "Smith",
        "avatar": "/assets/images/placeholders/avatar-2.jpg"
      },
      "likesCount": 28,
      "commentsCount": 7,
      "isLiked": true,
      "createdAt": "2024-01-19T15:45:00Z",
      "updatedAt": "2024-01-19T15:45:00Z"
    }
  ]
}
EOF

# Update main styles.scss
echo -e "${YELLOW}🎨 Updating main styles file...${NC}"
cat > src/styles.scss << 'EOF'
@import './assets/styles/variables';
@import './assets/styles/mixins';
@import './assets/styles/themes';

// Bootstrap or Angular Material imports would go here
// @import '~bootstrap/scss/bootstrap';
// @import '~@angular/material/prebuilt-themes/indigo-pink.css';

// Global styles
* {
  box-sizing: border-box;
}

html {
  font-size: 16px;
  scroll-behavior: smooth;
}

body {
  margin: 0;
  font-family: $font-family-base;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: $line-height-base;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  -webkit-text-size-adjust: 100%;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
}

// Typography
h1, h2, h3, h4, h5, h6 {
  margin-top: 0;
  margin-bottom: 0.5rem;
  font-weight: $font-weight-semibold;
  line-height: 1.2;
  color: var(--text-primary);
}

h1 { font-size: $font-size-xxl; }
h2 { font-size: $font-size-xl; }
h3 { font-size: $font-size-lg; }
h4 { font-size: $font-size-base; }
h5 { font-size: $font-size-sm; }
h6 { font-size: $font-size-sm; }

p {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--text-secondary);
}

// Links
a {
  color: var(--color-primary);
  text-decoration: none;
  transition: $transition-fast;

  &:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }
}

// Buttons
.btn {
  display: inline-block;
  font-weight: $font-weight-medium;
  line-height: 1.5;
  text-align: center;
  text-decoration: none;
  vertical-align: middle;
  cursor: pointer;
  user-select: none;
  border: 1px solid transparent;
  padding: 0.375rem 0.75rem;
  font-size: $font-size-base;
  border-radius: $border-radius;
  transition: $transition-base;

  &:focus {
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(var(--color-primary), 0.25);
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.65;
  }
}

.btn-primary {
  @include button-variant(var(--color-white), var(--color-primary), var(--color-primary));
}

.btn-secondary {
  @include button-variant(var(--color-white), var(--color-secondary), var(--color-secondary));
}

.btn-outline-primary {
  @include button-variant(var(--color-primary), transparent, var(--color-primary));
}

// Forms
.form-control {
  display: block;
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: $font-size-base;
  font-weight: $font-weight-normal;
  line-height: 1.5;
  color: var(--text-primary);
  background-color: var(--bg-primary);
  background-clip: padding-box;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;

  &:focus {
    color: var(--text-primary);
    background-color: var(--bg-primary);
    border-color: var(--color-primary-light);
    outline: 0;
    box-shadow: 0 0 0 0.2rem rgba(var(--color-primary), 0.25);
  }

  &::placeholder {
    color: var(--text-muted);
    opacity: 1;
  }

  &:disabled {
    background-color: var(--bg-secondary);
    opacity: 1;
  }
}

.form-label {
  margin-bottom: 0.5rem;
  font-weight: $font-weight-medium;
  color: var(--text-primary);
}

.form-text {
  margin-top: 0.25rem;
  font-size: $font-size-sm;
  color: var(--text-muted);
}

.invalid-feedback {
  display: block;
  width: 100%;
  margin-top: 0.25rem;
  font-size: $font-size-sm;
  color: var(--color-danger);
}

// Cards
.card {
  position: relative;
  display: flex;
  flex-direction: column;
  min-width: 0;
  word-wrap: break-word;
  background-color: var(--bg-primary);
  background-clip: border-box;
  border: 1px solid var(--border-color);
  border-radius: $border-radius;
  @include card-shadow(1);
  transition: $transition-base;

  &:hover {
    @include card-shadow(2);
  }
}

.card-body {
  flex: 1 1 auto;
  padding: 1rem;
}

.card-header {
  padding: 0.5rem 1rem;
  margin-bottom: 0;
  background-color: var(--bg-secondary);
  border-bottom: 1px solid var(--border-color);
  border-top-left-radius: $border-radius;
  border-top-right-radius: $border-radius;
}

.card-footer {
  padding: 0.5rem 1rem;
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  border-bottom-left-radius: $border-radius;
  border-bottom-right-radius: $border-radius;
}

// Utilities
.d-none { display: none !important; }
.d-inline { display: inline !important; }
.d-inline-block { display: inline-block !important; }
.d-block { display: block !important; }
.d-flex { display: flex !important; }
.d-grid { display: grid !important; }

.flex-row { flex-direction: row !important; }
.flex-column { flex-direction: column !important; }
.flex-wrap { flex-wrap: wrap !important; }
.flex-nowrap { flex-wrap: nowrap !important; }

.justify-content-start { justify-content: flex-start !important; }
.justify-content-end { justify-content: flex-end !important; }
.justify-content-center { justify-content: center !important; }
.justify-content-between { justify-content: space-between !important; }
.justify-content-around { justify-content: space-around !important; }

.align-items-start { align-items: flex-start !important; }
.align-items-end { align-items: flex-end !important; }
.align-items-center { align-items: center !important; }
.align-items-baseline { align-items: baseline !important; }
.align-items-stretch { align-items: stretch !important; }

.text-start { text-align: left !important; }
.text-end { text-align: right !important; }
.text-center { text-align: center !important; }

.text-primary { color: var(--color-primary) !important; }
.text-secondary { color: var(--text-secondary) !important; }
.text-muted { color: var(--text-muted) !important; }
.text-success { color: var(--color-success) !important; }
.text-danger { color: var(--color-danger) !important; }
.text-warning { color: var(--color-warning) !important; }
.text-info { color: var(--color-info) !important; }

// Spacing utilities
@each $prop, $abbrev in (margin: m, padding: p) {
  @each $size, $length in $spacers {
    .#{$abbrev}-#{$size} { #{$prop}: $length !important; }
    .#{$abbrev}t-#{$size} { #{$prop}-top: $length !important; }
    .#{$abbrev}e-#{$size} { #{$prop}-right: $length !important; }
    .#{$abbrev}b-#{$size} { #{$prop}-bottom: $length !important; }
    .#{$abbrev}s-#{$size} { #{$prop}-left: $length !important; }
    .#{$abbrev}x-#{$size} {
      #{$prop}-right: $length !important;
      #{$prop}-left: $length !important;
    }
    .#{$abbrev}y-#{$size} {
      #{$prop}-top: $length !important;
      #{$prop}-bottom: $length !important;
    }
  }
}

// Responsive utilities
@include media-breakpoint-up(sm) {
  .d-sm-none { display: none !important; }
  .d-sm-inline { display: inline !important; }
  .d-sm-inline-block { display: inline-block !important; }
  .d-sm-block { display: block !important; }
  .d-sm-flex { display: flex !important; }
}

@include media-breakpoint-up(md) {
  .d-md-none { display: none !important; }
  .d-md-inline { display: inline !important; }
  .d-md-inline-block { display: inline-block !important; }
  .d-md-block { display: block !important; }
  .d-md-flex { display: flex !important; }
}

@include media-breakpoint-up(lg) {
  .d-lg-none { display: none !important; }
  .d-lg-inline { display: inline !important; }
  .d-lg-inline-block { display: inline-block !important; }
  .d-lg-block { display: block !important; }
  .d-lg-flex { display: flex !important; }
}

// Animation classes
.fade-in {
  @include fade-in();
}

.slide-up {
  @include slide-up();
}

.loading-spinner {
  @include loading-spinner();
}

// Custom scrollbar
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: var(--bg-secondary);
}

::-webkit-scrollbar-thumb {
  background: var(--color-gray-400);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-gray-500);
}

// Focus visible for accessibility
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

// Reduced motion
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
EOF

# Update app.config.ts
echo -e "${YELLOW}⚙️ Updating app configuration...${NC}"
cat > src/app/app.config.ts << 'EOF'
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(
      routes,
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    provideAnimations(),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production && environment.features.enablePWA,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ],
};
EOF

# Update app.routes.ts
echo -e "${YELLOW}🗺️ Updating main routing...${NC}"
cat > src/app/app.routes.ts << 'EOF'
import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AdminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/home/home.routes').then(r => r.homeRoutes),
      },
      {
        path: 'profile',
        loadChildren: () => import('./features/profile/profile.routes').then(r => r.profileRoutes),
      },
      {
        path: 'posts',
        loadChildren: () => import('./features/posts/posts.routes').then(r => r.postRoutes),
      },
      {
        path: 'notifications',
        loadChildren: () => import('./features/notifications/notifications.routes').then(r => r.notificationRoutes),
      },
      {
        path: 'settings',
        loadChildren: () => import('./features/settings/settings.routes').then(r => r.settingsRoutes),
      }
    ]
  },
  {
    path: 'admin',
    loadComponent: () => import('./layout/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    canActivate: [AuthGuard, AdminGuard],
    children: [
      {
        path: '',
        loadChildren: () => import('./features/admin/admin.routes').then(r => r.adminRoutes),
      }
    ]
  },
  {
    path: 'auth',
    loadComponent: () => import('./layout/auth-layout/auth-layout.component').then(c => c.AuthLayoutComponent),
    loadChildren: () => import('./features/auth/auth.routes').then(r => r.authRoutes),
  },
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(c => c.NotFoundComponent),
  }
];
EOF

# Create additional route files with basic content
echo -e "${YELLOW}📄 Creating remaining route files...${NC}"

cat > src/app/features/home/home.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/home/home.component').then(c => c.HomeComponent),
    title: '01Blog - Home'
  }
];
EOF

cat > src/app/features/posts/posts.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const postRoutes: Routes = [
  {
    path: 'create',
    loadComponent: () => import('./components/post-create/post-create.component').then(c => c.PostCreateComponent),
    title: '01Blog - Create Post'
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./components/post-edit/post-edit.component').then(c => c.PostEditComponent),
    title: '01Blog - Edit Post'
  },
  {
    path: ':id',
    loadComponent: () => import('./components/post-detail/post-detail.component').then(c => c.PostDetailComponent),
    title: '01Blog - Post Detail'
  }
];
EOF

cat > src/app/features/profile/profile.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const profileRoutes: Routes = [
  {
    path: 'me',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    title: '01Blog - My Profile'
  },
  {
    path: 'edit',
    loadComponent: () => import('./components/profile-edit/profile-edit.component').then(c => c.ProfileEditComponent),
    title: '01Blog - Edit Profile'
  },
  {
    path: ':username',
    loadComponent: () => import('./components/profile/profile.component').then(c => c.ProfileComponent),
    title: '01Blog - User Profile'
  }
];
EOF

cat > src/app/features/notifications/notifications.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const notificationRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/notification-list/notification-list.component').then(c => c.NotificationListComponent),
    title: '01Blog - Notifications'
  }
];
EOF

cat > src/app/features/admin/admin.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const adminRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/admin-dashboard/admin-dashboard.component').then(c => c.AdminDashboardComponent),
    title: '01Blog - Admin Dashboard'
  },
  {
    path: 'users',
    loadComponent: () => import('./components/user-management/user-management.component').then(c => c.UserManagementComponent),
    title: '01Blog - User Management'
  },
  {
    path: 'posts',
    loadComponent: () => import('./components/post-management/post-management.component').then(c => c.PostManagementComponent),
    title: '01Blog - Post Management'
  },
  {
    path: 'reports',
    loadComponent: () => import('./components/report-management/report-management.component').then(c => c.ReportManagementComponent),
    title: '01Blog - Report Management'
  },
  {
    path: 'analytics',
    loadComponent: () => import('./components/analytics/analytics.component').then(c => c.AnalyticsComponent),
    title: '01Blog - Analytics'
  }
];
EOF

cat > src/app/features/settings/settings.routes.ts << 'EOF'
import { Routes } from '@angular/router';

export const settingsRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/settings/settings.component').then(c => c.SettingsComponent),
    title: '01Blog - Settings'
  }
];
EOF

# Create a simple not-found component
echo -e "${YELLOW}🚫 Creating not-found component...${NC}"
ng generate component shared/components/not-found --skip-tests

# Create package.json scripts addition
echo -e "${YELLOW}📦 Creating additional npm scripts...${NC}"
cat >> package.json << 'EOF'
,
  "scripts": {
    "build:prod": "ng build --configuration production",
    "build:staging": "ng build --configuration staging",
    "test:watch": "ng test --watch",
    "test:coverage": "ng test --code-coverage",
    "lint": "ng lint",
    "lint:fix": "ng lint --fix",
    "e2e": "ng e2e",
    "analyze": "npm run build:prod -- --stats-json && npx webpack-bundle-analyzer dist/blog-frontend/stats.json",
    "serve:pwa": "npm run build:prod && npx http-server dist/blog-frontend -p 8080"
  }
EOF

# Create README.md
echo -e "${YELLOW}📖 Creating README.md...${NC}"
cat > README.md << 'EOF'
# 01Blog - Social Learning Platform

A modern social blogging platform built with Angular and Spring Boot, designed for students to share their learning journey, discoveries, and progress.

## 🚀 Features

### User Features
- **Authentication**: Secure user registration, login, and profile management
- **Personal Block Page**: User profiles with post management and subscription system
- **Posts**: Create, edit, delete posts with media support (images/videos)
- **Social Interaction**: Like, comment, and subscribe to other users
- **Feed**: Personalized home feed with posts from subscribed users
- **Notifications**: Real-time updates for new posts, likes, and comments
- **Reporting**: Report inappropriate content or users

### Admin Features
- **User Management**: View, ban, and manage all users
- **Content Moderation**: Remove inappropriate posts and content
- **Report Management**: Handle user reports and take appropriate actions
- **Analytics**: Basic platform statistics and insights

## 🛠️ Tech Stack

### Frontend
- **Angular 17+** with standalone components
- **TypeScript** with strict typing
- **SCSS** for styling
- **Angular Signals** for state management
- **Angular Material** or **Bootstrap** for UI components
- **PWA** support for mobile experience

### Architecture
- **Feature-based structure** for scalability
- **Lazy loading** for optimal performance
- **Signal-based state management**
- **Reactive forms** for user input
- **OnPush change detection** strategy
- **Modern Angular patterns** (inject(), control flow, etc.)

## 📁 Project Structure

```
src/app/
├── core/                 # Singleton services, guards, interceptors
├── shared/               # Reusable components, pipes, directives
├── features/             # Feature modules (auth, home, posts, etc.)
├── layout/              # Layout components (main, admin, auth)
└── assets/              # Static assets and styles
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Angular CLI (`npm install -g @angular/cli`)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd blog-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Configuration**
   
   Update `src/environments/environment.ts` with your backend API URL:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     // ... other config
   };
   ```

4. **Run the development server**
   ```bash
   ng serve
   ```

5. **Open your browser**
   Navigate to `http://localhost:4200`

## 🔧 Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm run build:prod` - Build with production configuration
- `npm test` - Run unit tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Run linting
- `npm run lint:fix` - Fix linting issues
- `npm run analyze` - Analyze bundle size

## 🎨 Styling

The project uses a custom SCSS architecture with:
- **CSS Custom Properties** for theming
- **SCSS mixins** for reusable styles
- **Responsive breakpoints** for mobile-first design
- **Dark/Light theme** support
- **Utility classes** for common styling patterns

## 🛡️ Security

- **JWT-based authentication**
- **Route guards** for access control
- **Input validation** and sanitization
- **CSRF protection**
- **Role-based access control** (User/Admin)

## 📱 Progressive Web App

The app includes PWA features:
- **Service Worker** for offline functionality
- **App manifest** for installability
- **Caching strategies** for better performance
- **Push notifications** (optional)

## 🧪 Testing

The project includes:
- **Unit tests** with Jasmine and Karma
- **Component testing** with Angular Testing Utilities
- **Service testing** with HTTP testing
- **E2E testing** setup (Cypress/Protractor)

## 🚀 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy to Static Hosting
The built files in `dist/blog-frontend/` can be deployed to:
- **Netlify**
- **Vercel**
- **GitHub Pages**
- **Firebase Hosting**
- **AWS S3 + CloudFront**

### Docker Support
```dockerfile
FROM nginx:alpine
COPY dist/blog-frontend /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Angular Team for the amazing framework
- Angular Material/Bootstrap for UI components
- Community contributors and testers

---

**Happy Coding! 🚀**
EOF

# Final success message
echo ""
echo -e "${GREEN}🎉 SUCCESS! Angular project structure generated successfully!${NC}"
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo -e "${YELLOW}1.${NC} cd blog-frontend"
echo -e "${YELLOW}2.${NC} npm install"
echo -e "${YELLOW}3.${NC} ng serve"
echo -e "${YELLOW}4.${NC} Open http://localhost:4200"
echo ""
echo -e "${BLUE}📚 What was generated:${NC}"
echo -e "${GREEN}✓${NC} Complete Angular project with standalone components"
echo -e "${GREEN}✓${NC} Feature-based architecture (auth, home, posts, profile, admin)"
echo -e "${GREEN}✓${NC} Core services (auth, storage, notifications)"
echo -e "${GREEN}✓${NC} Guards and interceptors for security"
echo -e "${GREEN}✓${NC} Shared components, pipes, and directives"
echo -e "${GREEN}✓${NC} TypeScript interfaces and models"
echo -e "${GREEN}✓${NC} SCSS architecture with themes and utilities"
echo -e "${GREEN}✓${NC} Routing configuration with lazy loading"
echo -e "${GREEN}✓${NC} Custom validators and form utilities"
echo -e "${GREEN}✓${NC} Environment configuration"
echo -e "${GREEN}✓${NC} PWA configuration"
echo -e "${GREEN}✓${NC} Comprehensive README documentation"
