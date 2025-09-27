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
