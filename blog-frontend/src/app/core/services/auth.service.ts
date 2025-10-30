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
  readonly isAdmin = computed(() => this._currentUser()?.role === "ADMIN" || false);

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

  register(data: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.authApi.register(data).pipe(
      tap((response) => {
        if (response) {
          console.log("inside register tap")

          this.handleAuthSuccess(response);
        }
      }),
      catchError((error) => {
        this._isLoading.set(false);
        return throwError(() => error);
      })
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.authApi.login(data).pipe(
      tap((response) => {
        // if (response.success && response.data) {
          this.handleAuthSuccess(response);
        // }
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
    console.log("inside handle auth success");
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
  removeToken() {
    return this.storage.clearAuth();
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

  refreshCurrentUser(user : User): void {
      this.storage.setUserData(user);
      this._currentUser.set(user);
    
  }
}
