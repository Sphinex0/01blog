import { Injectable, inject, signal, effect } from '@angular/core';
import { StorageService } from '../../../core/services/storage.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly storage = inject(StorageService);
  
  // Signal for current theme
  private readonly _currentTheme = signal<Theme>('light');
  readonly currentTheme = this._currentTheme.asReadonly();

  constructor() {
    // Initialize theme from storage or system preference
    this.initializeTheme();

    // Apply theme whenever it changes
    effect(() => {
      const theme = this._currentTheme();
      this.applyTheme(theme);
      this.storage.setTheme(theme);
    });
  }

  private initializeTheme(): void {
    // Check storage first
    const storedTheme = this.storage.getTheme() as Theme;
    
    if (storedTheme) {
      this._currentTheme.set(storedTheme);
    } else {
      // Check system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this._currentTheme.set(prefersDark ? 'dark' : 'light');
    }
  }

  private applyTheme(theme: Theme): void {
    const root = document.documentElement;
    
    // Remove both classes first
    root.classList.remove('light-theme', 'dark-theme');
    
    // Add the current theme class
    root.classList.add(`${theme}-theme`);
    
    // Update meta theme color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', theme === 'dark' ? '#1a1a1a' : '#f0f0f0');
    }
  }

  toggleTheme(): void {
    const newTheme = this._currentTheme() === 'light' ? 'dark' : 'light';
    this._currentTheme.set(newTheme);
  }

  setTheme(theme: Theme): void {
    this._currentTheme.set(theme);
  }

  isDarkMode(): boolean {
    return this._currentTheme() === 'dark';
  }
}