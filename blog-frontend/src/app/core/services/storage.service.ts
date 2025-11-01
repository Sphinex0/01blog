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
