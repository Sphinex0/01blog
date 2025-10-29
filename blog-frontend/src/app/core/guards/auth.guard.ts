import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ROUTES } from '../constants/app.constants';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    console.log("authGuard inside condition")
    return true;
  }
  console.log("authGuard")

  // // Not authenticated, redirect to login
  // router.navigate([ROUTES.AUTH.LOGIN], {
  //   queryParams: { returnUrl: state.url }
  // });
  // return false;
  return router.navigate([ROUTES.AUTH.LOGIN], {
    queryParams: { returnUrl: state.url }
  });
};
