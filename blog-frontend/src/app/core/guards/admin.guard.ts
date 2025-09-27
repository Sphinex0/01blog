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
