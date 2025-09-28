import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatBadge, MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { RouterModule } from '@angular/router';
import { ROUTES } from '../../../../core/constants/app.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { LoginRequest } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-login',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatBadgeModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar)

  // Signals

  readonly hidePassword = signal(true);
  readonly isLoading = this.authService.isLoading;


  // Routes
  readonly registerRoute = ROUTES.AUTH.REGISTER;

  loginForm: FormGroup;

  constructor() {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        // CustomValidators.passwordStrength()
      ]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword())
  }


  onSubmit(): void {
    if (this.loginForm.valid) {
      // const { registerData } = this.loginForm.value;
      const request: LoginRequest = this.loginForm.value;

      this.authService.login(request).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open('Login successful! Welcome to 01Blog!', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar']
            });
          }
        },
        error: (error) => {
          const message = error.error?.message || 'Login failed. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar']
          });
        }
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }


  getFieldErrorMessage(fieldName: string): string {
    const control = this.loginForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }

    switch (fieldName) {
      case 'username':
        if (control?.hasError('username')) {
          return 'Please enter a valid email or username';
        }
        break;

      case 'password':
        if (control?.hasError('minlength')) {
          return 'Password must be at least 8 characters';
        }
        if (control?.hasError('passwordStrength')) {
          return 'Password must contain uppercase, lowercase, number, and special character';
        }
        break;

    }

    return '';
  }


  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      username: 'Username/Email',
      password: 'Password'
    };
    return displayNames[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.loginForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

}
