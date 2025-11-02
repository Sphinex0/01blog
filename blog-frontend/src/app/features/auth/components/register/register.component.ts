import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AuthService } from '../../../../core/services/auth.service';
import { CustomValidators } from '../../../../shared/validators/custom-validators';
import { passwordConfirmValidator } from '../../../../shared/validators/password-match.validator';
import { RegisterRequest } from '../../../../core/models/user.interface';
import { ROUTES } from '../../../../core/constants/app.constants';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly hidePassword = signal(true);
  readonly hideConfirmPassword = signal(true);
  readonly isLoading = this.authService.isLoading;

  // Routes
  readonly loginRoute = ROUTES.AUTH.LOGIN;

  registerForm: FormGroup;

  constructor() {
    this.registerForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2), CustomValidators.fullName()]],
      username: ['', [Validators.required, CustomValidators.username()]],
      email: ['', [Validators.required, CustomValidators.email()]],
      password: [
        '',
        [Validators.required, Validators.minLength(8), CustomValidators.passwordStrength()],
      ],
      confirmPassword: ['', [Validators.required, passwordConfirmValidator('password')]],
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword.set(!this.hidePassword());
  }

  toggleConfirmPasswordVisibility(): void {
    this.hideConfirmPassword.set(!this.hideConfirmPassword());
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...registerData } = this.registerForm.value;
      const request: RegisterRequest = registerData;

      this.authService.register(request).subscribe({
        next: (response) => {
          if (response) {
            this.snackBar.open('Registration successful! Welcome to 01Blog!', 'Close', {
              duration: 5000,
              panelClass: ['success-snackbar'],
            });
          }
        },
        error: (error) => {
          const message = error.error || 'Registration failed. Please try again.';
          this.snackBar.open(message, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.registerForm.controls).forEach((key) => {
      const control = this.registerForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldErrorMessage(fieldName: string): string {
    const control = this.registerForm.get(fieldName);
    if (control?.hasError('required')) {
      return `${this.getFieldDisplayName(fieldName)} is required`;
    }

    switch (fieldName) {
      case 'fullName':
        if (control?.hasError('minlength')) {
          return 'Full name must be at least 2 characters';
        }
        if (control?.hasError('fullName')) {
          return 'Full name can only contain letters and spaces';
        }
        break;

      case 'username':
        if (control?.hasError('username')) {
          const error = control.errors?.['username'];
          if (!error.startsWithLetter) {
            return 'Username must start with a letter';
          }
          if (!error.hasValidChars) {
            return 'Username can only contain letters, numbers, underscores, and hyphens';
          }
          if (!error.isValidLength) {
            return `Username must be between ${error.minLength} and ${error.maxLength} characters`;
          }
        }
        break;

      case 'email':
        if (control?.hasError('email')) {
          return 'Please enter a valid email address';
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

      case 'confirmPassword':
        if (control?.hasError('passwordConfirm')) {
          return 'Passwords do not match';
        }
        break;
    }

    return '';
  }

  private getFieldDisplayName(fieldName: string): string {
    const displayNames: Record<string, string> = {
      fullName: 'Full name',
      username: 'Username',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm password',
    };
    return displayNames[fieldName] || fieldName;
  }

  hasFieldError(fieldName: string): boolean {
    const control = this.registerForm.get(fieldName);
    return !!(control?.invalid && (control?.dirty || control?.touched));
  }

  // Password validation computed properties
  passwordHasMinLength = computed(() => {
    const password = this.registerForm.get('password')?.value || '';
    return password.length >= 8;
  });

  passwordHasUppercase = computed(() => {
    const password = this.registerForm.get('password')?.value || '';
    return /[A-Z]/.test(password);
  });

  passwordHasLowercase = computed(() => {
    const password = this.registerForm.get('password')?.value || '';
    return /[a-z]/.test(password);
  });

  passwordHasNumber = computed(() => {
    const password = this.registerForm.get('password')?.value || '';
    return /[0-9]/.test(password);
  });

  passwordHasSpecial = computed(() => {
    const password = this.registerForm.get('password')?.value || '';
    return /[#?!@$%^&*-]/.test(password);
  });
}
