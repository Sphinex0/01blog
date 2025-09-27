import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class CustomValidators {
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const hasNumber = /[0-9]/.test(value);
      const hasUpper = /[A-Z]/.test(value);
      const hasLower = /[a-z]/.test(value);
      const hasSpecial = /[#?!@$%^&*-]/.test(value);
      const isValidLength = value.length >= 8;

      const valid = hasNumber && hasUpper && hasLower && hasSpecial && isValidLength;

      if (!valid) {
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

  static usernameValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) {
        return null;
      }

      const isValidLength = value.length >= 3 && value.length <= 50;
      const hasValidChars = /^[a-zA-Z0-9_-]+$/.test(value);
      const startsWithLetter = /^[a-zA-Z]/.test(value);

      const valid = isValidLength && hasValidChars && startsWithLetter;

      if (!valid) {
        return {
          username: {
            isValidLength,
            hasValidChars,
            startsWithLetter
          }
        };
      }

      return null;
    };
  }

  static fileExtension(allowedExtensions: string[]): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) {
        return null;
      }

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

  static fileSize(maxSizeInMB: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const file = control.value as File;
      if (!file) {
        return null;
      }

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
}
