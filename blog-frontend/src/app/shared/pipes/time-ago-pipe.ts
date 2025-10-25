import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeAgo',
  standalone: true
})
export class TimeAgoPipe implements PipeTransform {
  
  transform(value: Date | string | number): string {
    if (!value) return '';

    const date = new Date(value);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    // Less than a minute
    if (seconds < 60) {
      return 'just now';
    }

    // Less than an hour
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    // Less than a day
    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    // Less than a week
    const days = Math.floor(hours / 24);
    if (days < 7) {
      return `${days}d ago`;
    }

    // Less than a month
    const weeks = Math.floor(days / 7);
    if (weeks < 4) {
      return `${weeks}w ago`;
    }

    // Less than a year
    const months = Math.floor(days / 30);
    if (months < 12) {
      return `${months}mo ago`;
    }

    // More than a year
    const years = Math.floor(days / 365);
    return `${years}y ago`;
  }

  /**
   * Calculates time left or expiration status for a ban date.
   */
  static timeUntil(expiryDate: Date | string | null): string {
    if (!expiryDate) return '';
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffSeconds = Math.floor((expiry.getTime() - now.getTime()) / 1000);

    if (diffSeconds <= 0) {
      return 'EXPIRED';
    }

    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30.44);
    const diffYears = Math.floor(diffDays / 365.25);

    if (diffYears >= 100) return 'PERMANENT';

    if (diffYears > 0) return `ENDS IN ${diffYears}Y`;
    if (diffMonths > 0) return `ENDS IN ${diffMonths}MO`;
    if (diffDays > 0) return `ENDS IN ${diffDays}D`;
    if (diffHours > 0) return `ENDS IN ${diffHours}H`;
    if (diffMinutes > 0) return `ENDS IN ${diffMinutes}M`;
    return 'ENDS SOON';
  }
}