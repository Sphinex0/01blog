import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return true;
  }

  authService.removeToken()
  // Not authenticated, redirect to login
  router.navigate([ROUTES.AUTH.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
  return false;
};
