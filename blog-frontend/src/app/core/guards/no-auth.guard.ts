import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const noAuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  console.log("noAuthGuard")
  if (authService.isAuthenticated()) {
    // Already authenticated, redirect to home
    router.navigate([ROUTES.HOME]);
    return false;
    // return router.navigate([ROUTES.HOME]);
  }
  console.log("noAuthGuard after condition")

  return true;
};
