#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Starting 01Blog Angular 20 Project Generation...${NC}"
echo ""

# Check if Angular CLI is installed and version
if ! command -v ng &> /dev/null; then
    echo -e "${RED}❌ Angular CLI is not installed. Installing latest version...${NC}"
    npm install -g @angular/cli@latest
fi

# Check Angular CLI version
echo -e "${YELLOW}📦 Checking Angular CLI version...${NC}"
ng version | grep "Angular CLI"

# Create new Angular project with latest version
echo -e "${YELLOW}📦 Creating Angular 20 project 'blog-frontend'...${NC}"
ng new blog-frontend --routing --style=scss --skip-git --package-manager=npm --standalone

cd blog-frontend

echo -e "${GREEN}✅ Project created successfully!${NC}"
echo ""

# Add Angular Material
echo -e "${YELLOW}🎨 Adding Angular Material...${NC}"
ng add @angular/material --theme=custom --typography=true --animations=true

# Add Angular PWA
echo -e "${YELLOW}📱 Adding PWA support...${NC}"
ng add @angular/pwa

echo -e "${GREEN}✅ Angular Material and PWA added!${NC}"
echo ""

# Create directory structure
echo -e "${YELLOW}📁 Creating directory structure...${NC}"

# Core directories
mkdir -p src/app/core/{guards,interceptors,services,models,constants}
mkdir -p src/app/shared/{components,directives,pipes,validators}
mkdir -p src/app/features/{auth,home,posts,profile,notifications,reporting,admin,settings}
mkdir -p src/app/layout/{main-layout,admin-layout,auth-layout}

# Assets directories  
mkdir -p src/assets/{images/{logos,icons,placeholders,backgrounds},styles,data}

echo -e "${GREEN}✅ Directory structure created!${NC}"
echo ""

# Generate Core Services
echo -e "${YELLOW}🛠️ Generating core services...${NC}"
ng generate service core/services/auth --skip-tests
ng generate service core/services/storage --skip-tests
ng generate service core/services/notification --skip-tests

# Generate Guards
echo -e "${YELLOW}🛡️ Generating guards...${NC}"
ng generate guard core/guards/auth --skip-tests
ng generate guard core/guards/admin --skip-tests  
ng generate guard core/guards/no-auth --skip-tests

# Generate Interceptors
echo -e "${YELLOW}🔄 Generating interceptors...${NC}"
ng generate interceptor core/interceptors/auth --skip-tests
ng generate interceptor core/interceptors/error --skip-tests
ng generate interceptor core/interceptors/loading --skip-tests

# Generate Shared Components
echo -e "${YELLOW}🧩 Generating shared components...${NC}"
ng generate component shared/components/header --skip-tests
ng generate component shared/components/footer --skip-tests
ng generate component shared/components/loading-spinner --skip-tests
ng generate component shared/components/confirmation-dialog --skip-tests
ng generate component shared/components/post-card --skip-tests
ng generate component shared/components/media-preview --skip-tests
ng generate component shared/components/user-avatar --skip-tests

# Generate Shared Directives
echo -e "${YELLOW}📝 Generating shared directives...${NC}"
ng generate directive shared/directives/auto-resize --skip-tests
ng generate directive shared/directives/infinite-scroll --skip-tests

# Generate Shared Pipes
echo -e "${YELLOW}🔧 Generating shared pipes...${NC}"
ng generate pipe shared/pipes/time-ago --skip-tests
ng generate pipe shared/pipes/safe-html --skip-tests
ng generate pipe shared/pipes/truncate --skip-tests

# Generate Layout Components
echo -e "${YELLOW}🏗️ Generating layout components...${NC}"
ng generate component layout/main-layout --skip-tests
ng generate component layout/admin-layout --skip-tests
ng generate component layout/auth-layout --skip-tests

# Generate Auth Feature
echo -e "${YELLOW}🔐 Generating authentication feature...${NC}"
mkdir -p src/app/features/auth/{components,services}
ng generate component features/auth/components/login --skip-tests
ng generate component features/auth/components/register --skip-tests
ng generate component features/auth/components/forgot-password --skip-tests
ng generate service features/auth/services/auth-api --skip-tests

# Generate Home Feature
echo -e "${YELLOW}🏠 Generating home feature...${NC}"
mkdir -p src/app/features/home/{components,services}
ng generate component features/home/components/home --skip-tests
ng generate component features/home/components/feed --skip-tests
ng generate component features/home/components/sidebar --skip-tests
ng generate service features/home/services/feed --skip-tests

# Generate Posts Feature
echo -e "${YELLOW}📝 Generating posts feature...${NC}"
mkdir -p src/app/features/posts/{components,services}
ng generate component features/posts/components/post-create --skip-tests
ng generate component features/posts/components/post-edit --skip-tests
ng generate component features/posts/components/post-detail --skip-tests
ng generate component features/posts/components/comment-section --skip-tests
ng generate component features/posts/components/comment-item --skip-tests
ng generate component features/posts/components/media-upload --skip-tests
ng generate service features/posts/services/post --skip-tests
ng generate service features/posts/services/comment --skip-tests
ng generate service features/posts/services/media --skip-tests

# Generate Profile Feature
echo -e "${YELLOW}👤 Generating profile feature...${NC}"
mkdir -p src/app/features/profile/{components,services}
ng generate component features/profile/components/profile --skip-tests
ng generate component features/profile/components/profile-header --skip-tests
ng generate component features/profile/components/profile-posts --skip-tests
ng generate component features/profile/components/profile-edit --skip-tests
ng generate component features/profile/components/followers-list --skip-tests
ng generate component features/profile/components/following-list --skip-tests
ng generate service features/profile/services/profile --skip-tests
ng generate service features/profile/services/subscription --skip-tests

# Generate Notifications Feature
echo -e "${YELLOW}🔔 Generating notifications feature...${NC}"
mkdir -p src/app/features/notifications/{components,services}
ng generate component features/notifications/components/notification-list --skip-tests
ng generate component features/notifications/components/notification-item --skip-tests
ng generate component features/notifications/components/notification-badge --skip-tests
ng generate service features/notifications/services/notification-api --skip-tests

# Generate Reporting Feature
echo -e "${YELLOW}🚨 Generating reporting feature...${NC}"
mkdir -p src/app/features/reporting/{components,services}
ng generate component features/reporting/components/report-dialog --skip-tests
ng generate component features/reporting/components/report-button --skip-tests
ng generate service features/reporting/services/report --skip-tests

# Generate Admin Feature
echo -e "${YELLOW}⚙️ Generating admin feature...${NC}"
mkdir -p src/app/features/admin/{components,services}
ng generate component features/admin/components/admin-dashboard --skip-tests
ng generate component features/admin/components/user-management --skip-tests
ng generate component features/admin/components/post-management --skip-tests
ng generate component features/admin/components/report-management --skip-tests
ng generate component features/admin/components/analytics --skip-tests
ng generate component features/admin/components/admin-sidebar --skip-tests
ng generate service features/admin/services/admin --skip-tests
ng generate service features/admin/services/user-management --skip-tests
ng generate service features/admin/services/analytics --skip-tests

# Generate Settings Feature
echo -e "${YELLOW}⚙️ Generating settings feature...${NC}"
mkdir -p src/app/features/settings/{components,services}
ng generate component features/settings/components/settings --skip-tests
ng generate component features/settings/components/theme-toggle --skip-tests
ng generate component features/settings/components/privacy-settings --skip-tests
ng generate service features/settings/services/theme --skip-tests
ng generate service features/settings/services/settings --skip-tests

# Create Interface files
echo -e "${YELLOW}📋 Creating interface files...${NC}"
cat > src/app/core/models/user.interface.ts << 'EOF'
export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
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

export interface RegisterRequest {
  fullName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
  expiresIn: number;
}

export interface UpdateUserRequest {
  fullName?: string;
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
  timestamp: Date;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ErrorResponse {
  error: string;
  message: string;
  statusCode: number;
  timestamp: Date;
  path?: string;
}
EOF

# Create Constants files
echo -e "${YELLOW}📝 Creating constants files...${NC}"
cat > src/app/core/constants/api.constants.ts << 'EOF'
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
    FOLLOW: '/users/follow',
    UNFOLLOW: '/users/unfollow',
    FOLLOWERS: '/users/followers',
    FOLLOWING: '/users/following',
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
    DELETE: '/comments',
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
EOF

cat > src/app/core/constants/app.constants.ts << 'EOF'
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
    MAX_POST_LENGTH: 2000,
    MAX_COMMENT_LENGTH: 500,
    MIN_USERNAME_LENGTH: 3,
    MAX_USERNAME_LENGTH: 50,
    MAX_FULLNAME_LENGTH: 100,
    MAX_BIO_LENGTH: 500,
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
    BASE: '/profile',
    ME: '/profile/me',
    EDIT: '/profile/edit',
    VIEW: '/profile',
  },
  POSTS: {
    BASE: '/posts',
    CREATE: '/posts/create',
    EDIT: '/posts/edit',
    DETAIL: '/posts',
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
  LIGHT: 'light',
  DARK: 'dark',
  AUTO: 'auto',
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

export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  SERVER_ERROR: 'Server error. Please try again later.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  FILE_TOO_LARGE: 'File size exceeds the maximum allowed limit.',
  INVALID_FILE_TYPE: 'Invalid file type. Please select a valid file.',
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
    enablePushNotifications: false,
    enableInfiniteScroll: true,
    enableDarkMode: true,
  },
  auth: {
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  media: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
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
    enablePushNotifications: true,
    enableInfiniteScroll: true,
    enableDarkMode: true,
  },
  auth: {
    tokenExpiration: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  media: {
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedImageTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    allowedVideoTypes: ['video/mp4', 'video/webm'],
  }
};
EOF

# Create Auth API Service
echo -e "${YELLOW}🔐 Creating Auth API Service...${NC}"
cat > src/app/features/auth/services/auth-api.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../../core/models/user.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      data
    );
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      data
    );
  }

  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {}
    );
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      { email }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      { token, newPassword }
    );
  }
}
EOF

# Create Auth Service
echo -e "${YELLOW}🔐 Creating Auth Service...${NC}"
cat > src/app/core/services/auth.service.ts << 'EOF'
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AuthApiService } from '../../features/auth/services/auth-api.service';
import { StorageService } from './storage.service';
import { User, RegisterRequest, LoginRequest, AuthResponse } from '../models/user.interface';
import { ApiResponse } from '../models/api-response.interface';
import { APP_CONSTANTS, ROUTES } from '../constants/app.constants';
import { Observable, tap, catchError, throwError, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly authApi = inject(AuthApiService);
  private readonly storage = inject(StorageService);
  private readonly router = inject(Router);

  // Signals for reactive state management
  private readonly _currentUser = signal<User | null>(null);
  private readonly _isAuthenticated = signal<boolean>(false);
  private readonly _isLoading = signal<boolean>(false);

  // Computed signals
  readonly currentUser = computed(() => this._currentUser());
  readonly isAuthenticated = computed(() => this._isAuthenticated());
  readonly isLoading = computed(() => this._isLoading());
  readonly isAdmin = computed(() => this._currentUser()?.isAdmin || false);

  constructor() {
    this.initializeAuth();
  }

  private initializeAuth(): void {
    const token = this.storage.getToken();
    const userData = this.storage.getUserData();
    
    if (token && userData) {
      this._currentUser.set(userData);
      this._isAuthenticated.set(true);
    }
  }

  register(data: RegisterRequest): Observable<ApiResponse<AuthResponse>> {
    this._isLoading.set(true);
    
    return this.authApi.register(data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  login(data: LoginRequest): Observable<ApiResponse<AuthResponse>> {
    this._isLoading.set(true);
    
    return this.authApi.login(data).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this._isLoading.set(true);
    
    this.authApi.logout().subscribe({
      complete: () => {
        this.handleLogout();
      },
      error: () => {
        // Even if API call fails, clear local data
        this.handleLogout();
      }
    });
  }

  refreshToken(): Observable<ApiResponse<AuthResponse>> {
    const refreshToken = this.storage.getRefreshToken();
    
    if (!refreshToken) {
      this.handleLogout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.authApi.refreshToken(refreshToken).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this.handleAuthSuccess(response.data);
        }
      }),
      catchError((error) => {
        this.handleLogout();
        return throwError(() => error);
      })
    );
  }

  private handleAuthSuccess(authData: AuthResponse): void {
    // Store tokens and user data
    this.storage.setToken(authData.token);
    this.storage.setRefreshToken(authData.refreshToken);
    this.storage.setUserData(authData.user);

    // Update signals
    this._currentUser.set(authData.user);
    this._isAuthenticated.set(true);
    this._isLoading.set(false);

    // Navigate to home page
    this.router.navigate([ROUTES.HOME]);
  }

  private handleLogout(): void {
    // Clear storage
    this.storage.clearAuth();

    // Reset signals
    this._currentUser.set(null);
    this._isAuthenticated.set(false);
    this._isLoading.set(false);

    // Navigate to login
    this.router.navigate([ROUTES.AUTH.LOGIN]);
  }

  updateUserProfile(user: User): void {
    this._currentUser.set(user);
    this.storage.setUserData(user);
  }

  getToken(): string | null {
    return this.storage.getToken();
  }

  isTokenExpired(): boolean {
    const token = this.getToken();
    if (!token) return true;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
}
EOF

# Create Storage Service
echo -e "${YELLOW}💾 Creating Storage Service...${NC}"
cat > src/app/core/services/storage.service.ts << 'EOF'
import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  setToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN, token);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
  }

  setUserData(user: User): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA, JSON.stringify(user));
  }

  getUserData(): User | null {
    const userData = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  setTheme(theme: string): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, theme);
  }

  getTheme(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME);
  }

  clearAuth(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER_DATA);
  }

  clear(): void {
    localStorage.clear();
  }
}
EOF

# Create Custom Validators
echo -e "${YELLOW}✅ Creating custom validators...${NC}"
cat > src/app/shared/validators/custom-validators.ts << 'EOF'
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH;

      if (!hasNumber || !hasUpper || !hasLower || !hasSpecial || !isValidLength) {
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

  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const minLength = APP_CONSTANTS.VALIDATION.MIN_USERNAME_LENGTH;
      const maxLength = APP_CONSTANTS.VALIDATION.MAX_USERNAME_LENGTH;
      
      const isValidLength = value.length >= minLength && value.length <= maxLength;
      const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(value);
      const startsWithLetter = /^[a-zA-Z]/.test(value);

      if (!isValidLength || !hasValidChars || !startsWithLetter) {
        return {
          username: {
            isValidLength,
            hasValidChars,
            startsWithLetter,
            minLength,
            maxLength
          }
        };
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return { email: true };
      }
      return null;
    };
  }

  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const maxLength = APP_CONSTANTS.VALIDATION.MAX_FULLNAME_LENGTH;
      const hasValidChars = /^[a-zA-Z\s]+$/.test(value);
      const isValidLength = value.length <= maxLength;

      if (!hasValidChars || !isValidLength) {
        return {
          fullName: {
            hasValidChars,
            isValidLength,
            maxLength
          }
        };
      }
      return null;
    };
  }

  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

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

  static fileExtension(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

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

export function passwordConfirmValidator(passwordControlName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get(passwordControlName);
    const confirmPassword = control;

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      return { passwordConfirm: true };
    }

    return null;
  };
}
EOF

# Create Register Component with Angular Material
echo -e "${YELLOW}📝 Creating Register Component with Angular Material...${NC}"
cat > src/app/features/auth/components/register/register.component.ts << 'EOF'
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { passwordConfirmValidator } from '../../../../shared/validators/password-match.validator';
import { RegisterRequest } from '../../../../core/models/user.interface';
import { ROUTES } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-register',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly isLoading = this.authService.isLoading;

  // Routes
  readonly loginRoute = ROUTES.AUTH.LOGIN;

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [
        Validators.required,
        Validators.minLength(2),
        CustomValidators.fullName()
      ]],
      username: ['', [
        Validators.required,
        CustomValidators.username()
      ]],
      email: ['', [
        Validators.required,
        CustomValidators.email()
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        CustomValidators.passwordStrength()
      ]],
      confirmPassword: ['', [
        Validators.required,
        passwordConfirmValidator('password')
      ]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      const request: RegisterRequest = registerData;

      this.authService.register(request).subscribe({
        next: (response) => {
          if (response.success) {
            this.snackBar.open('Registration successful! Welcome to 01Blog!', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach(key => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }

    switch (fieldName) {
      case 'fullName':
        if (control?.hasError('minlength')) {
          return 'Full name must be at least 2 characters';
        }
        if (control?.hasError('fullName')) {
          return 'Full name can only contain letters and spaces';
        }
        break;

      case 'username':
        if (control?.hasError('username')) {
          const error = control.errors?.['username'];
          if (!error.startsWithLetter) {
            return 'Username must start with a letter';
          }
          if (!error.hasValidChars) {
            return 'Username can only contain letters, numbers, underscores, and hyphens';
          }
          if (!error.isValidLength) {
            return `Username must be between ${error.minLength} and ${error.maxLength} characters`;
          }
        }
        break;

      case 'email':
        if (control?.hasError('email')) {
          return 'Please enter a valid email address';
        }
        break;

      case 'password':
        if (control?.hasError('minlength')) {
          return 'Password must be at least 8 characters';
        }
        if (control?.hasError('passwordStrength')) {
          return 'Password must contain uppercase, lowercase, number, and special character';
        }
        break;

      case 'confirmPassword':
        if (control?.hasError('passwordConfirm')) {
          return 'Passwords do not match';
        }
        break;
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      fullName: 'Full name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password'
    };
    return displayNames[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }
}
EOF

# Create Register Component HTML
cat > src/app/features/auth/components/register/register.component.html << 'EOF'
<div class="register-container">
  <mat-card class="register-card">
    <mat-card-header>
      <mat-card-title class="register-title">
        <mat-icon class="register-icon">account_circle</mat-icon>
        Join 01Blog
      </mat-card-title>
      <mat-card-subtitle>
        Start your learning journey and share your discoveries
      </mat-card-subtitle>
    </mat-card-header>

    <mat-card-content>
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()" class="register-form">
        
        <!-- Full Name Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Full Name</mat-label>
          <input 
            matInput 
            formControlName="fullName" 
            placeholder="Enter your full name"
            autocomplete="name">
          <mat-icon matSuffix>person</mat-icon>
          @if (hasFieldError('fullName')) {
            <mat-error>{{ getFieldErrorMessage('fullName') }}</mat-error>
          }
        </mat-form-field>

        <!-- Username Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Username</mat-label>
          <input 
            matInput 
            formControlName="username" 
            placeholder="Choose a unique username"
            autocomplete="username">
          <mat-icon matSuffix>alternate_email</mat-icon>
          @if (hasFieldError('username')) {
            <mat-error>{{ getFieldErrorMessage('username') }}</mat-error>
          }
        </mat-form-field>

        <!-- Email Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Email</mat-label>
          <input 
            matInput 
            type="email" 
            formControlName="email" 
            placeholder="Enter your email address"
            autocomplete="email">
          <mat-icon matSuffix>email</mat-icon>
          @if (hasFieldError('email')) {
            <mat-error>{{ getFieldErrorMessage('email') }}</mat-error>
          }
        </mat-form-field>

        <!-- Password Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Password</mat-label>
          <input 
            matInput 
            [type]="hidePassword() ? 'password' : 'text'" 
            formControlName="password" 
            placeholder="Create a strong password"
            autocomplete="new-password">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hidePassword()">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (hasFieldError('password')) {
            <mat-error>{{ getFieldErrorMessage('password') }}</mat-error>
          }
        </mat-form-field>

        <!-- Confirm Password Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input 
            matInput 
            [type]="hideConfirmPassword() ? 'password' : 'text'" 
            formControlName="confirmPassword" 
            placeholder="Confirm your password"
            autocomplete="new-password">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="toggleConfirmPasswordVisibility()"
            [attr.aria-label]="'Hide confirm password'"
            [attr.aria-pressed]="hideConfirmPassword()">
            <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (hasFieldError('confirmPassword')) {
            <mat-error>{{ getFieldErrorMessage('confirmPassword') }}</mat-error>
          }
        </mat-form-field>

        <!-- Password Requirements -->
        <div class="password-requirements">
          <p class="requirements-title">Password must contain:</p>
          <ul class="requirements-list">
            <li>At least 8 characters</li>
            <li>One uppercase letter (A-Z)</li>
            <li>One lowercase letter (a-z)</li>
            <li>One number (0-9)</li>
            <li>One special character (#?!@$%^&*-)</li>
          </ul>
        </div>

        <!-- Submit Button -->
        <button 
          mat-raised-button 
          color="primary" 
          type="submit" 
          class="submit-button full-width"
          [disabled]="registerForm.invalid || isLoading()">
          
          @if (isLoading()) {
            <ng-container>
              <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
              Creating Account...
            </ng-container>
          } @else {
            <ng-container>
              <mat-icon>person_add</mat-icon>
              Create Account
            </ng-container>
          }
        </button>

      </form>
    </mat-card-content>

    <mat-card-actions class="card-actions">
      <div class="login-link">
        Already have an account? 
        <a [routerLink]="loginRoute" class="link">Sign in here</a>
      </div>
    </mat-card-actions>

  </mat-card>
</div>new-password">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="togglePasswordVisibility()"
            [attr.aria-label]="'Hide password'"
            [attr.aria-pressed]="hidePassword()">
            <mat-icon>{{ hidePassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (hasFieldError('password')) {
            <mat-error>{{ getFieldErrorMessage('password') }}</mat-error>
          }
        </mat-form-field>

        <!-- Confirm Password Field -->
        <mat-form-field appearance="outline" class="full-width">
          <mat-label>Confirm Password</mat-label>
          <input 
            matInput 
            [type]="hideConfirmPassword() ? 'password' : 'text'" 
            formControlName="confirmPassword" 
            placeholder="Confirm your password"
            autocomplete="new-password">
          <button 
            mat-icon-button 
            matSuffix 
            type="button"
            (click)="toggleConfirmPasswordVisibility()"
            [attr.aria-label]="'Hide confirm password'"
            [attr.aria-pressed]="hideConfirmPassword()">
            <mat-icon>{{ hideConfirmPassword() ? 'visibility_off' : 'visibility' }}</mat-icon>
          </button>
          @if (hasFieldError('confirmPassword')) {
            <mat-error>{{ getFieldErrorMessage('confirmPassword') }}</mat-error>
          }
        </mat-form-field>

        <!-- Password Requirements -->
        <div class="password-requirements">
          <p class="requirements-title">Password must contain:</p>
          <ul class="requirements-list">
            <li>At least 8 characters</li>
            <li>One uppercase letter (A-Z)</li>
            <li>One lowercase letter (a-z)</li>
            <li>One number (0-9)</li>
            <li>One special character (#?!@$%^&*-)</li>
          </ul>
        </div>

        <!-- Submit Button -->
        <button 
          mat-raised-button 
          color="primary" 
          type="submit" 
          class="submit-button full-width"
          [disabled]="registerForm.invalid || isLoading()">
          
          @if (isLoading()) {
            <mat-spinner diameter="20" class="button-spinner"></mat-spinner>
            Creating Account...
          } @else {
            <mat-icon>person_add</mat-icon>
            Create Account
          }
        </button>

      </form>
    </mat-card-content>

    <mat-card-actions class="card-actions">
      <div class="login-link">
        Already have an account? 
        <a [routerLink]="loginRoute" class="link">Sign in here</a>
      </div>
    </mat-card-actions>

  </mat-card>
</div>
EOF

# Create Register Component SCSS
cat > src/app/features/auth/components/register/register.component.scss << 'EOF'
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.register-card {
  width: 100%;
  max-width: 480px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border-radius: 12px;
  overflow: hidden;
}

.register-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
}

.register-icon {
  font-size: 1.75rem;
  width: 1.75rem;
  height: 1.75rem;
  color: #667eea;
}

mat-card-header {
  padding-bottom: 1rem;
}

mat-card-content {
  padding: 0 1.5rem 1rem;
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.full-width {
  width: 100%;
}

mat-form-field {
  .mat-mdc-text-field-wrapper {
    border-radius: 8px;
  }
}

.password-requirements {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin-top: 0.5rem;

  .requirements-title {
    margin: 0 0 0.5rem 0;
    font-weight: 500;
    color: #495057;
    font-size: 0.875rem;
  }

  .requirements-list {
    margin: 0;
    padding-left: 1.25rem;
    color: #6c757d;
    font-size: 0.8125rem;

    li {
      margin-bottom: 0.25rem;
    }
  }
}

.submit-button {
  height: 48px;
  font-size: 1rem;
  font-weight: 500;
  border-radius: 8px;
  margin-top: 1rem;
  
  &:not(:disabled) {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    
    &:hover {
      background: linear-gradient(135deg, #5a6fd8 0%, #6b4190 100%);
    }
  }

  .button-spinner {
    margin-right: 8px;
  }

  mat-icon {
    margin-right: 8px;
  }
}

.card-actions {
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.login-link {
  text-align: center;
  color: #6c757d;
  font-size: 0.875rem;

  .link {
    color: #667eea;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;

    &:hover {
      color: #5a6fd8;
      text-decoration: underline;
    }
  }
}

// Responsive design
@media (max-width: 600px) {
  .register-container {
    padding: 0.5rem;
  }

  .register-card {
    margin: 0;
    border-radius: 0;
  }

  mat-card-content {
    padding: 0 1rem 1rem;
  }

  .card-actions {
    padding: 1rem;
  }
}

// Error styles
:host ::ng-deep {
  .success-snackbar {
    --mdc-snackbar-container-color: #d4edda;
    --mdc-snackbar-supporting-text-color: #155724;
  }

  .error-snackbar {
    --mdc-snackbar-container-color: #f8d7da;
    --mdc-snackbar-supporting-text-color: #721c24;
  }
}

// Animation
.register-card {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Focus styles
mat-form-field.mat-focused {
  .mat-mdc-form-field-outline-thick {
    color: #667eea;
  }
}

// Loading state
.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
EOF

# Update app.config.ts for Angular 20
echo -e "${YELLOW}⚙️ Updating app configuration for Angular 20...${NC}"
cat > src/app/app.config.ts << 'EOF'
import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding, withRouterConfig } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideServiceWorker } from '@angular/service-worker';
import { MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // Router configuration
    provideRouter(
      routes,
      withComponentInputBinding(),
      withRouterConfig({
        paramsInheritanceStrategy: 'always',
      })
    ),
    
    // HTTP client with interceptors
    provideHttpClient(
      withInterceptors([
        authInterceptor,
        errorInterceptor,
        loadingInterceptor,
      ])
    ),
    
    // Animations
    provideAnimationsAsync(),
    
    // Service Worker for PWA
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production && environment.features.enablePWA,
      registrationStrategy: 'registerWhenStable:30000'
    }),
    
    // Material Design configuration
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'outline',
        subscriptSizing: 'dynamic'
      }
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 4000,
        horizontalPosition: 'right',
        verticalPosition: 'top'
      }
    }
  ],
};
EOF

# Create Auth Guard
echo -e "${YELLOW}🛡️ Creating Auth Guard...${NC}"
cat > src/app/core/guards/auth.guard.ts << 'EOF'
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Check if token is expired
    if (authService.isTokenExpired()) {
      // Try to refresh token
      authService.refreshToken().subscribe({
        next: () => {
          return true;
        },
        error: () => {
          router.navigate([ROUTES.AUTH.LOGIN], {
            queryParams: { returnUrl: state.url }
          });
          return false;
        }
      });
    }
    return true;
  }

  // Not authenticated, redirect to login
  router.navigate([ROUTES.AUTH.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
EOF

# Create No Auth Guard
echo -e "${YELLOW}🚫 Creating No Auth Guard...${NC}"
cat > src/app/core/guards/no-auth.guard.ts << 'EOF'
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    // Already authenticated, redirect to home
    router.navigate([ROUTES.HOME]);
    return false;
  }

  return true;
};
EOF

# Create Admin Guard
echo -e "${YELLOW}👑 Creating Admin Guard...${NC}"
cat > src/app/core/guards/admin.guard.ts << 'EOF'
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const adminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate([ROUTES.AUTH.LOGIN]);
    return false;
  }

  if (!authService.isAdmin()) {
    router.navigate([ROUTES.HOME]);
    return false;
  }

  return true;
};
EOF

# Create Auth Interceptor
echo -e "${YELLOW}🔄 Creating Auth Interceptor...${NC}"
cat > src/app/core/interceptors/auth.interceptor.ts << 'EOF'
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
    return next(authReq);
  }

  return next(req);
};
EOF

# Create Error Interceptor
echo -e "${YELLOW}❌ Creating Error Interceptor...${NC}"
cat > src/app/core/interceptors/error.interceptor.ts << 'EOF'
import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../services/auth.service';
import { ERROR_MESSAGES, HTTP_STATUS_CODES } from '../constants/app.constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      let errorMessage: string = ERROR_MESSAGES.SERVER_ERROR;

      switch (error.status) {
        case HTTP_STATUS_CODES.UNAUTHORIZED:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          // Auto logout on 401
          authService.logout();
          break;
        case HTTP_STATUS_CODES.BAD_REQUEST:
          errorMessage = error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case HTTP_STATUS_CODES.NOT_FOUND:
          errorMessage = 'Resource not found';
          break;
        case HTTP_STATUS_CODES.CONFLICT:
          errorMessage = error.error?.message || 'Conflict occurred';
          break;
        case 0:
          errorMessage = ERROR_MESSAGES.NETWORK_ERROR;
          break;
        default:
          errorMessage = error.error?.message || ERROR_MESSAGES.SERVER_ERROR;
      }

      // Show error message (except for auth requests to avoid double notifications)
      if (!req.url.includes('/auth/')) {
        snackBar.open(errorMessage, 'Close', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }

      return throwError(() => error);
    })
  );
};
EOF

# Create Loading Interceptor
echo -e "${YELLOW}⏳ Creating Loading Interceptor...${NC}"
cat > src/app/core/interceptors/loading.interceptor.ts << 'EOF'
import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { finalize } from 'rxjs';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService);

  loadingService.show();

  return next(req).pipe(
    finalize(() => loadingService.hide())
  );
};
EOF

# Create Loading Service
echo -e "${YELLOW}⏳ Creating Loading Service...${NC}"
cat > src/app/core/services/loading.service.ts << 'EOF'
import { Injectable, signal, computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private readonly _activeRequests = signal(0);
  
  readonly isLoading = computed(() => this._activeRequests() > 0);

  show(): void {
    this._activeRequests.update(count => count + 1);
  }

  hide(): void {
    this._activeRequests.update(count => Math.max(0, count - 1));
  }

  reset(): void {
    this._activeRequests.set(0);
  }
}
EOF

# Create Auth Layout Component
echo -e "${YELLOW}🏗️ Creating Auth Layout Component...${NC}"
cat > src/app/layout/auth-layout/auth-layout.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  imports: [CommonModule, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss'
})
export class AuthLayoutComponent {}
EOF

cat > src/app/layout/auth-layout/auth-layout.component.html << 'EOF'
<div class="auth-layout">
  <div class="auth-background"></div>
  <div class="auth-content">
    <router-outlet></router-outlet>
  </div>
</div>
EOF

cat > src/app/layout/auth-layout/auth-layout.component.scss << 'EOF'
.auth-layout {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.auth-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  z-index: -1;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url('/assets/images/backgrounds/pattern.svg') repeat;
    opacity: 0.1;
  }
}

.auth-content {
  width: 100%;
  max-width: 500px;
  padding: 1rem;
}

@media (max-width: 600px) {
  .auth-content {
    padding: 0.5rem;
  }
}
EOF

# Create Main Layout Component
echo -e "${YELLOW}🏠 Creating Main Layout Component...${NC}"
cat > src/app/layout/main-layout/main-layout.component.ts << 'EOF'
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSidenavModule } from '@angular/material/sidenav';
import { AuthService } from '../../core/services/auth.service';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';

@Component({
  selector: 'app-main-layout',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatSidenavModule,
    HeaderComponent,
    FooterComponent,
  ],
  templateUrl: './main-layout.component.html',
  styleUrl: './main-layout.component.scss'
})
export class MainLayoutComponent {
  private readonly authService = inject(AuthService);
  
  readonly currentUser = this.authService.currentUser;
  readonly isMobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(isOpen => !isOpen);
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
  }
}
EOF

cat > src/app/layout/main-layout/main-layout.component.html << 'EOF'
<div class="main-layout">
  <mat-sidenav-container class="sidenav-container">
    
    <!-- Mobile Sidebar -->
    <mat-sidenav 
      #drawer 
      class="sidenav" 
      fixedInViewport 
      [attr.role]="'dialog'" 
      [mode]="'over'"
      [opened]="isMobileMenuOpen()">
      
      <div class="sidenav-content">
        <div class="sidenav-header">
          <h3>01Blog</h3>
          <button mat-icon-button (click)="closeMobileMenu()">
            <mat-icon>close</mat-icon>
          </button>
        </div>
        
        <nav class="sidenav-nav">
          <!-- Navigation items will go here -->
          <a mat-button routerLink="/" (click)="closeMobileMenu()">
            <mat-icon>home</mat-icon>
            Home
          </a>
          <a mat-button routerLink="/profile/me" (click)="closeMobileMenu()">
            <mat-icon>person</mat-icon>
            My Profile
          </a>
          <a mat-button routerLink="/posts/create" (click)="closeMobileMenu()">
            <mat-icon>add</mat-icon>
            Create Post
          </a>
          <a mat-button routerLink="/notifications" (click)="closeMobileMenu()">
            <mat-icon>notifications</mat-icon>
            Notifications
          </a>
          <a mat-button routerLink="/settings" (click)="closeMobileMenu()">
            <mat-icon>settings</mat-icon>
            Settings
          </a>
        </nav>
      </div>
    </mat-sidenav>

    <!-- Main Content -->
    <mat-sidenav-content>
      <app-header 
        [currentUser]="currentUser()" 
        (mobileMenuToggle)="toggleMobileMenu()">
      </app-header>
      
      <main class="main-content">
        <router-outlet></router-outlet>
      </main>
      
      <app-footer></app-footer>
    </mat-sidenav-content>
    
  </mat-sidenav-container>
</div>
EOF

cat > src/app/layout/main-layout/main-layout.component.scss << 'EOF'
.main-layout {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.sidenav-container {
  flex: 1;
}

.sidenav {
  width: 280px;
}

.sidenav-content {
  padding: 1rem;
}

.sidenav-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #e0e0e0;

  h3 {
    margin: 0;
    color: #333;
    font-weight: 600;
  }
}

.sidenav-nav {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  a {
    justify-content: flex-start;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    transition: background-color 0.2s ease;

    &:hover {
      background-color: #f5f5f5;
    }

    &.active {
      background-color: #e3f2fd;
      color: #1976d2;
    }

    mat-icon {
      margin-right: 0.75rem;
    }
  }
}

.main-content {
  flex: 1;
  padding: 0;
  background-color: #fafafa;
  min-height: calc(100vh - 64px - 60px); // Account for header and footer
}

@media (max-width: 768px) {
  .sidenav {
    width: 100vw;
  }
}
EOF

# Update main app routes
echo -e "${YELLOW}🗺️ Updating main app routes...${NC}"
cat > src/app/app.routes.ts << 'EOF'
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/main-layout/main-layout.component').then(c => c.MainLayoutComponent),
    canActivate: [authGuard],
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
    canActivate: [authGuard, adminGuard],
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
    redirectTo: '/auth/login'
  }
];
EOF

# Update auth routes with noAuthGuard
cat > src/app/features/auth/auth.routes.ts << 'EOF'
import { Routes } from '@angular/router';
import { noAuthGuard } from '../../core/guards/no-auth.guard';

export const authRoutes: Routes = [
  {
    path: '',
    canActivate: [noAuthGuard],
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

# Create a basic header component
echo -e "${YELLOW}📄 Creating Header Component...${NC}"
cat > src/app/shared/components/header/header.component.ts << 'EOF'
import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../../core/models/user.interface';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  // Inputs
  readonly currentUser = input<User | null>();

  // Outputs
  readonly mobileMenuToggle = output<void>();

  onLogout(): void {
    this.authService.logout();
  }

  onMobileMenuToggle(): void {
    this.mobileMenuToggle.emit();
  }
}
EOF

cat > src/app/shared/components/header/header.component.html << 'EOF'
<mat-toolbar color="primary" class="header-toolbar">
  
  <!-- Mobile menu button -->
  <button 
    mat-icon-button 
    class="mobile-menu-button" 
    (click)="onMobileMenuToggle()"
    aria-label="Open menu">
    <mat-icon>menu</mat-icon>
  </button>

  <!-- Logo -->
  <a routerLink="/" class="logo">
    <mat-icon class="logo-icon">book</mat-icon>
    <span class="logo-text">01Blog</span>
  </a>

  <!-- Spacer -->
  <span class="spacer"></span>

  <!-- Desktop Navigation -->
  <nav class="desktop-nav">
    <a mat-button routerLink="/" routerLinkActive="active-link">
      <mat-icon>home</mat-icon>
      Home
    </a>
    <a mat-button routerLink="/posts/create" routerLinkActive="active-link">
      <mat-icon>add</mat-icon>
      Create
    </a>
    <a mat-button routerLink="/notifications" routerLinkActive="active-link">
      <mat-icon matBadge="3" matBadgeColor="warn" matBadgeSize="small">notifications</mat-icon>
      Notifications
    </a>
  </nav>

  <!-- User Menu -->
  @if (currentUser(); as user) {
    <button mat-icon-button [matMenuTriggerFor]="userMenu" class="user-menu-trigger">
      <mat-icon>account_circle</mat-icon>
    </button>
    
    <mat-menu #userMenu="matMenu">
      <div class="user-info">
        <div class="user-name">{{ user.fullName }}</div>
        <div class="user-username">@{{ user.username }}</div>
      </div>
      <mat-divider></mat-divider>
      
      <a mat-menu-item routerLink="/profile/me">
        <mat-icon>person</mat-icon>
        My Profile
      </a>
      
      <a mat-menu-item routerLink="/settings">
        <mat-icon>settings</mat-icon>
        Settings
      </a>
      
      @if (user.isAdmin) {
        <mat-divider></mat-divider>
        <a mat-menu-item routerLink="/admin">
          <mat-icon>admin_panel_settings</mat-icon>
          Admin Panel
        </a>
      }
      
      <mat-divider></mat-divider>
      
      <button mat-menu-item (click)="onLogout()">
        <mat-icon>logout</mat-icon>
        Logout
      </button>
    </mat-menu>
  }

</mat-toolbar>
EOF

cat > src/app/shared/components/header/header.component.scss << 'EOF'
.header-toolbar {
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.mobile-menu-button {
  margin-right: 1rem;
  
  @media (min-width: 768px) {
    display: none;
  }
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: white;
  font-weight: 600;
  font-size: 1.25rem;
  
  &:hover {
    color: white;
  }
}

.logo-icon {
  margin-right: 0.5rem;
  font-size: 1.5rem;
  width: 1.5rem;
  height: 1.5rem;
}

.logo-text {
  @media (max-width: 480px) {
    display: none;
  }
}

.spacer {
  flex: 1 1 auto;
}

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-right: 1rem;
  
  @media (max-width: 768px) {
    display: none;
  }

  a {
    color: white;
    
    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
    
    &.active-link {
      background-color: rgba(255, 255, 255, 0.2);
    }

    mat-icon {
      margin-right: 0.5rem;
    }
  }
}

.user-menu-trigger {
  color: white;
}

:host ::ng-deep {
  .user-info {
    padding: 8px 16px;
    
    .user-name {
      font-weight: 500;
      font-size: 0.875rem;
    }
    
    .user-username {
      font-size: 0.75rem;
      color: #666;
    }
  }
}
EOF

# Create a basic footer component
echo -e "${YELLOW}🦶 Creating Footer Component...${NC}"
cat > src/app/shared/components/footer/footer.component.ts << 'EOF'
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-footer',
  imports: [CommonModule, RouterModule, MatIconModule, MatButtonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
EOF

cat > src/app/shared/components/footer/footer.component.html << 'EOF'
<footer class="footer">
  <div class="footer-content">
    <div class="footer-section">
      <h3>01Blog</h3>
      <p>Share your learning journey and discover others' experiences.</p>
    </div>
    
    <div class="footer-section">
      <h4>Quick Links</h4>
      <nav>
        <a routerLink="/">Home</a>
        <a routerLink="/posts/create">Create Post</a>
        <a routerLink="/settings">Settings</a>
      </nav>
    </div>
    
    <div class="footer-section">
      <h4>Community</h4>
      <nav>
        <a href="#">Help Center</a>
        <a href="#">Community Guidelines</a>
        <a href="#">Contact Us</a>
      </nav>
    </div>
  </div>
  
  <div class="footer-bottom">
    <p>&copy; {{ currentYear }} 01Blog. All rights reserved.</p>
  </div>
</footer>
EOF

cat > src/app/shared/components/footer/footer.component.scss << 'EOF'
.footer {
  background-color: #263238;
  color: white;
  margin-top: auto;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
}

.footer-section {
  h3, h4 {
    margin: 0 0 1rem 0;
    color: #fff;
  }

  h3 {
    font-size: 1.25rem;
    font-weight: 600;
  }

  h4 {
    font-size: 1rem;
    font-weight: 500;
  }

  p {
    margin: 0;
    color: #b0bec5;
    line-height: 1.5;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    a {
      color: #b0bec5;
      text-decoration: none;
      transition: color 0.2s ease;
      
      &:hover {
        color: white;
      }
    }
  }
}

.footer-bottom {
  border-top: 1px solid #37474f;
  padding: 1rem;
  text-align: center;
  
  p {
    margin: 0;
    color: #78909c;
    font-size: 0.875rem;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    text-align: center;
  }
}
EOF

# Create package.json scripts for Angular 20
echo -e "${YELLOW}📦 Updating package.json scripts...${NC}"
npm pkg set scripts.build:prod="ng build --configuration production"
npm pkg set scripts.build:staging="ng build --configuration staging"
npm pkg set scripts.test:watch="ng test --watch"
npm pkg set scripts.test:coverage="ng test --code-coverage"
npm pkg set scripts.test:ci="ng test --watch=false --browsers=ChromeHeadless"
npm pkg set scripts.lint="ng lint"
npm pkg set scripts.lint:fix="ng lint --fix"
npm pkg set scripts.e2e="ng e2e"
npm pkg set scripts.analyze="npm run build:prod -- --stats-json && npx webpack-bundle-analyzer dist/blog-frontend/stats.json"
npm pkg set scripts.serve:pwa="npm run build:prod && npx http-server dist/blog-frontend -p 8080"
npm pkg set scripts.update:deps="ng update"

# Install additional dependencies
echo -e "${YELLOW}📦 Installing additional dependencies...${NC}"
npm install @angular/material @angular/cdk @angular/animations
npm install --save-dev @angular-eslint/builder @angular-eslint/eslint-plugin @angular-eslint/eslint-plugin-template @angular-eslint/schematics @angular-eslint/template-parser
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
npm install rxjs@latest

# Create README.md with Angular 20 specific information
echo -e "${YELLOW}📖 Creating comprehensive README.md...${NC}"
cat > README.md << 'EOF'
# 01Blog - Social Learning Platform

A modern social blogging platform built with **Angular 20** and **Spring Boot**, designed for students to share their learning journey, discoveries, and progress.

## 🚀 Features

### User Features
- **Authentication**: Secure registration, login with JWT tokens
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
- **Analytics**: Platform statistics and insights

## 🛠️ Tech Stack

### Frontend (Angular 20)
- **Angular 20** with standalone components
- **TypeScript** with strict typing
- **Angular Material** for UI components
- **SCSS** for styling with custom theme system
- **Angular Signals** for reactive state management
- **Zoneless Change Detection** for better performance
- **PWA** support for mobile experience
- **Modern Angular patterns**: `inject()`, control flow, component input binding

## 📁 Project Architecture

```
src/app/
├── core/                 # Singleton services, guards, interceptors
│   ├── guards/          # Auth, admin, no-auth guards
│   ├── interceptors/    # Auth, error, loading interceptors
│   ├── services/        # Auth, storage, notification services
│   ├── models/          # TypeScript interfaces
│   └── constants/       # API endpoints, app constants
├── shared/              # Reusable components, pipes, directives
│   ├── components/      # Header, footer, loading spinner, etc.
│   ├── pipes/           # Time ago, safe HTML, truncate
│   ├── directives/      # Auto-resize, infinite scroll
│   └── validators/      # Custom form validators
├── features/            # Feature modules
│   ├── auth/           # Login, register, forgot password
│   ├── home/           # Dashboard, feed, sidebar
│   ├── posts/          # CRUD operations, comments, media
│   ├── profile/        # User profiles, followers, following
│   ├── notifications/  # Notification management
│   ├── reporting/      # Report content and users
│   ├── admin/          # Admin panel and management
│   └── settings/       # App settings, theme toggle
├── layout/             # Layout components
│   ├── main-layout/    # Authenticated user layout
│   ├── admin-layout/   # Admin panel layout
│   └── auth-layout/    # Authentication pages layout
└── assets/             # Static assets, styles, images
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v20 or higher)
- **npm** or **yarn**
- **Angular CLI** (`npm install -g @angular/cli@latest`)

### Installation

1. **Generate the project structure**
   ```bash
   chmod +x generate-01blog-structure.sh
   ./generate-01blog-structure.sh
   ```

2. **Navigate to project**
   ```bash
   cd blog-frontend
   ```

3. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

4. **Environment Configuration**
   
   Update `src/environments/environment.ts`:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080/api',
     // ... other config
   };
   ```

5. **Start development server**
   ```bash
   ng serve
   ```

6. **Open browser**
   ```
   http://localhost:4200
   ```

## 🔧 Available Scripts

```bash
# Development
npm start                 # Start development server
ng serve --open          # Start with auto-open browser

# Building  
npm run build            # Build for production
npm run build:prod       # Build with production config
npm run build:staging    # Build with staging config

# Testing
npm test                 # Run unit tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:ci          # Run tests for CI/CD

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix ESLint issues

# Analysis
npm run analyze          # Analyze bundle size
npm run serve:pwa        # Test PWA build locally

# Dependencies
npm run update:deps      # Update Angular dependencies
```

## 🎨 Styling & Theming

### SCSS Architecture
```scss
src/assets/styles/
├── _variables.scss      # Colors, typography, spacing
├── _mixins.scss         # Reusable mixins  
├── _themes.scss         # Light/dark themes
├── _components.scss     # Component-specific styles
└── _utilities.scss      # Utility classes
```

### Theme Support
- **Light/Dark themes** with CSS custom properties
- **Angular Material theming** integration
- **Responsive design** with mobile-first approach
- **Custom color palette** and typography

## 🛡️ Security Features

- **JWT Authentication** with refresh tokens
- **Route Guards** for access control (auth, admin, no-auth)
- **HTTP Interceptors** for automatic token attachment
- **Input Validation** with custom validators
- **Role-based Access Control** (User/Admin)
- **CSRF Protection** ready
- **Secure Storage** for sensitive data

## 🚀 Angular 20 Features

### Modern Architecture
- **Zoneless Change Detection** for better performance
- **Standalone Components** (no NgModules)
- **Signals** for reactive state management
- **Control Flow** syntax (`@if`, `@for`, `@switch`)
- **Component Input Binding** for route parameters

### Performance Optimizations
- **Lazy Loading** for all feature modules
- **OnPush Change Detection** strategy
- **Tree-shaking** with standalone components  
- **Bundle Splitting** for optimal loading
- **Service Worker** for caching and offline support

### Developer Experience
- **inject()** function for dependency injection
- **Functional Guards and Interceptors**
- **Type-safe Routing** with route parameters
- **Built-in Control Flow** syntax
- **Improved DevTools** support

## 📱 Progressive Web App

### PWA Features
- **Service Worker** for offline functionality
- **App Manifest** for installability
- **Caching Strategies** for better performance
- **Push Notifications** (configurable)
- **Responsive Design** for all screen sizes

## 🧪 Testing Strategy

### Unit Testing
- **Jasmine** and **Karma** for unit tests
- **Angular Testing Utilities** for component testing
- **Signal Testing** with Angular 20 patterns
- **HTTP Testing** for service mocking

### E2E Testing
- **Cypress** or **Playwright** setup ready
- **Page Object Pattern** for maintainable tests
- **CI/CD Integration** ready

## 🚀 Deployment

### Build for Production
```bash
npm run build:prod
```

### Deploy Options
- **Netlify**: Drag and drop `dist/blog-frontend/`
- **Vercel**: Connect GitHub repository
- **Firebase Hosting**: `firebase deploy`
- **AWS S3 + CloudFront**: Static hosting
- **Docker**: Container-ready

### Docker Support
```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build:prod

FROM nginx:alpine
COPY --from=build /app/dist/blog-frontend /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🔄 API Integration

### Backend Configuration
```typescript
// API Base URL
const API_BASE_URL = 'http://localhost:8080/