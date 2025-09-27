import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { APP_CONSTANTS } from '../../core/constants/app.constants';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= APP_CONSTANTS.VALIDATION.MIN_PASSWORD_LENGTH;

      if (!hasNumber || !hasUpper || !hasLower || !hasSpecial || !isValidLength) {
        return {
          passwordStrength: {
            hasNumber,
            hasUpper,
            hasLower,
            hasSpecial,
            isValidLength
          }
        };
      }
      return null;
    };
  }

  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const minLength = APP_CONSTANTS.VALIDATION.MIN_USERNAME_LENGTH;
      const maxLength = APP_CONSTANTS.VALIDATION.MAX_USERNAME_LENGTH;
      
      const isValidLength = value.length >= minLength && value.length <= maxLength;
      const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(value);
      const startsWithLetter = /^[a-zA-Z]/.test(value);

      if (!isValidLength || !hasValidChars || !startsWithLetter) {
        return {
          username: {
            isValidLength,
            hasValidChars,
            startsWithLetter,
            minLength,
            maxLength
          }
        };
      }
      return null;
    };
  }

  static email(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      if (!emailRegex.test(value)) {
        return { email: true };
      }
      return null;
    };
  }

  static fullName(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const maxLength = APP_CONSTANTS.VALIDATION.MAX_FULLNAME_LENGTH;
      const hasValidChars = /^[a-zA-Z\s]+$/.test(value);
      const isValidLength = value.length <= maxLength;

      if (!hasValidChars || !isValidLength) {
        return {
          fullName: {
            hasValidChars,
            isValidLength,
            maxLength
          }
        };
      }
      return null;
    };
  }

  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
      if (file.size > maxSizeInBytes) {
        return {
          fileSize: {
            actualSize: file.size,
            maxSize: maxSizeInBytes,
            actualSizeMB: (file.size / (1024 * 1024)).toFixed(2),
            maxSizeMB: maxSizeInMB
          }
        };
      }
      return null;
    };
  }

  static fileExtension(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) return null;

      const extension = file.name.split('.').pop()?.toLowerCase();
      if (!extension || !allowedExtensions.includes(extension)) {
        return {
          fileExtension: {
            actualExtension: extension,
            allowedExtensions
          }
        };
      }
      return null;
    };
  }
}
