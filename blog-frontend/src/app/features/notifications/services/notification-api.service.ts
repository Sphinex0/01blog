import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar'; // Import MatSnackBar
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { WebSocketService } from '../../../core/services/websocket.service';
import { AuthService } from '../../../core/services/auth.service';
import { Notification } from '../../../core/models/notification.interface';

@Injectable({
  providedIn: 'root'
})
export class NotificationApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;
  private readonly wsService = inject(WebSocketService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals for state management
  private readonly _notifications = signal<Notification[]>([]);
  private readonly _unreadCount = signal<number>(0);
  private readonly _isLoading = signal<boolean>(false);

  // Public computed signals
  readonly notifications = computed(() => this._notifications());
  readonly unreadCount = computed(() => this._unreadCount());
  readonly isLoading = computed(() => this._isLoading());
  
  constructor() {
    this.setupWebSocketConnection();
  }
  
  private setupWebSocketConnection(): void {
    // 1. Use effect() to react to changes in the isAuthenticated signal
    effect(() => {
      const isAuthenticated = this.authService.isAuthenticated(); // Read the signal's value
      if (isAuthenticated) {
        this.wsService.connect();
      } else {
        this.wsService.disconnect();
      }
    });

    // 2. Subscribe to new post notifications from the WebSocket service's Observable
    this.wsService.newPost$.subscribe(notification => {
      this.handleNewPostNotification(notification);
    });
  }
  
  /**
   * Handles a real-time notification received via WebSocket.
   */
  private handleNewPostNotification(notification: Notification): void {
    console.log('Real-time Notification received:', notification);
    
    // Increment the unread count
    this._unreadCount.update(count => count + 1);
    
    // Add the full notification object to the beginning of the list
    this._notifications.update(notifications => [notification, ...notifications]);
    
    // Show a snackbar/toast to alert the user
    this.snackBar.open(`New Post from @${notification.sender.username}`, 'View', {
      duration: 5000,
      panelClass: ['success-snackbar']
    });
  }

  /**
   * Get all notifications from the API.
   */
  getNotifications(cursor: number): Observable<Notification[]> {
    this._isLoading.set(true);

    return this.http.get<Notification[]>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.GET_ALL}?cursor=${cursor}`
    ).pipe(
      tap((response) => {
        if (response) {
          if (cursor === 0) {
            // If refreshing, replace the list entirely with fresh data
            this._notifications.set(response);
          } else {
            // Append to existing notifications
            this._notifications.update(notifications => [...notifications, ...response]);
          }
           // Re-calculate the actual unread count based on fetched data
          //  this.updateUnreadCount(this._notifications());
        }
        this._isLoading.set(false);
      })
    );
  }

  /**
   * Get unread notifications count from the API.
   */
  getUnreadCount(): Observable<{ count: number }> {
    return this.http.get<{ count: number }>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.UNREAD_COUNT}`
    ).pipe(
      tap((response) => {
        this._unreadCount.set(response.count);
      })
    );
  }

  /**
   * Mark a single notification as read.
   */
  markAsRead(notificationId: number): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ}/${notificationId}`,
      {}
    ).pipe(
      tap(() => {
        // Update notification in local state
        this._notifications.update(notifications =>
          notifications.map(n =>
            n.id === notificationId ? { ...n, read: true } : n
          )
        );
        this._unreadCount.update(count => Math.max(0, count - 1));
      })
    );
  }

  /**
   * Mark all notifications as read.
   */
  markAllAsRead(): Observable<void> {
    return this.http.put<void>(
      `${this.baseUrl}${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ}`,
      {}
    ).pipe(
      tap(() => {
        // Update all notifications to read
        this._notifications.update(notifications =>
          notifications.map(n => ({ ...n, read: true }))
        );
        this._unreadCount.set(0);
      })
    );
  }

  /**
   * Delete a single notification.
   */
  deleteNotification(notificationId: number): Observable<void> {
    return this.http.delete<void>(
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
   * Recalculates the unread count based on the current list of notifications.
   */
  private updateUnreadCount(notifications: Notification[]): void {
    const unreadCount = notifications.filter(n => !n.read).length;
    // this._unreadCount.set(unreadCount);
  }
}