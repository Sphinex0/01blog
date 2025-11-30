import { Injectable } from '@angular/core';
import { User } from '../models/user.interface';
import { APP_CONSTANTS } from '../constants/app.constants';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  setToken(token: string): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN, token);
  }

  getToken(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  getUserData(): User | null {
    const decoded: any = jwtDecode(this.getToken() || '');

    const user = {
      username: decoded.username || decoded.sub,
      id: decoded.id,
      email: decoded.email,
      fullName: decoded.fullname,
      avatar: decoded.avatar,
      role: decoded.role || 'USER',
    };
    return user as User;
  }

  setTheme(theme: string): void {
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.THEME, theme);
  }

  getTheme(): string | null {
    return localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.THEME);
  }

  clearAuth(): void {
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.ACCESS_TOKEN);
  }

  clear(): void {
    localStorage.clear();
  }
}
