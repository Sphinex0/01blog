import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Notification } from '../../../core/models/notification.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  // Signals for state management
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _unreadCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);

  // Public computed signals
  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(() => this._unreadCount());
  readonly isLoading = computed(() => this._isLoading());

  /**
   * Get all notifications
   */
  getNotifications(): Observable<Notification[]> {
    this._isLoading.set(true);

    return this.http.get<Notification[]>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}`
    ).pipe(
      tap((response) => {
        if (response) {
          
          this._notifications.set(response);
          // this.updateUnreadCount(response.data);
        }
        this._isLoading.set(false);
      })
    );
  }

  /**
   * Get unread notifications count
   */
  getUnreadCount(): Observable<ApiResponse<{ count: number }>> {
    return this.http.get<ApiResponse<{ count: number }>>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT}`
    ).pipe(
      tap((response) => {
        if (response.success && response.data) {
          this._unreadCount.set(response.data.count);
        }
      })
    );
  }

  /**
   * Mark notification as read
   */
  markAsRead(notificationId: number): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ}/${notificationId}`,
      {}
    ).pipe(
      tap(() => {
        // Update notification in local state
        this._notifications.update(notifications =>
          notifications.map(n =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        this._unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }

  /**
   * Mark all notifications as read
   */
  markAllAsRead(): Observable<ApiResponse<void>> {
    return this.http.put<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ}`,
      {}
    ).pipe(
      tap(() => {
        // Update all notifications to read
        this._notifications.update(notifications =>
          notifications.map(n => ({ ...n, isRead: true }))
        );
        this._unreadCount.set(0);
      })
    );
  }

  /**
   * Delete notification
   */
  deleteNotification(notificationId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}/notifications/${notificationId}`
    ).pipe(
      tap(() => {
        // Remove notification from local state
        this._notifications.update(notifications =>
          notifications.filter(n => n.id !== notificationId)
        );
      })
    );
  }

  /**
   * Clear all notifications
   */
  clearAllNotifications(): void {
    this._notifications.set([]);
    this._unreadCount.set(0);
  }

  /**
   * Update unread count from notifications list
   */
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    this._unreadCount.set(unreadCount);
  }

  /**
   * Add new notification (for real-time updates)
   */
  addNotification(notification: Notification): void {
    this._notifications.update(notifications => [notification, ...notifications]);
    if (!notification.read) {
      this._unreadCount.update(count => count + 1);
    }
  }
}