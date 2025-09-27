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
