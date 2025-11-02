import { Component, OnInit, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { NotificationApiService } from '../../services/notification-api.service';
import { Notification } from '../../../../core/models/notification.interface';
import { NotificationItemComponent } from '../notification-item/notification-item.component';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-notification-list',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    MatTabsModule,
    NotificationItemComponent,
    InfiniteScrollDirective,
  ],
  templateUrl: './notification-list.component.html',
  styleUrl: './notification-list.component.scss'
})
export class NotificationListComponent implements OnInit {
  private readonly notificationService = inject(NotificationApiService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);

  // Computed signals
  readonly notifications = this.notificationService.notifications;
  readonly isLoading = this.notificationService.isLoading;
  readonly unreadCount = this.notificationService.unreadCount;

  // Filtered notifications
  readonly unreadNotifications = computed(() => 
    this.notifications().filter(n => !n.read)
  );

  readonly readNotifications = computed(() => 
    this.notifications().filter(n => n.read)
  );

  readonly cursor = signal(0);
  readonly hasMore = signal(true);

  ngOnInit(): void {
    this.loadNotifications();
    // Also update unread count
    // this.notificationService.getUnreadCount().subscribe();
  }
  

  loadNotifications(): void {
    this.notificationService.getNotifications(this.cursor()).subscribe({
      next: (notifications) => {
        // Successfully loaded notifications
        this.cursor.set(notifications[notifications.length - 1]?.id || 0);
        this.hasMore.set(notifications.length > 0);

      },
      error: (err) => {
        this.snackBar.open('Failed to load notifications', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onNotificationClick(notification: Notification): void {

    // Navigate based on notification type
    if (notification.postId) {
      this.router.navigate(['/posts', notification.postId]);
    } 
  }

  onMarkAsRead(notificationId: number): void {
    this.notificationService.markAsRead(notificationId).subscribe({
      next: () => {
        this.snackBar.open('Marked as read', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: () => {
        this.snackBar.open('Failed to mark as read', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  onDelete(notificationId: number): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Notification',
        message: 'Are you sure you want to delete this notification?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'warning'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.notificationService.deleteNotification(notificationId).subscribe({
          next: () => {
            this.snackBar.open('Notification deleted', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar']
            });
          },
          error: () => {
            this.snackBar.open('Failed to delete notification', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }

  onMarkAllAsRead(): void {
    if (this.unreadNotifications().length === 0) {
      return;
    }

    this.notificationService.markAllAsRead().subscribe({
      next: () => {
        this.snackBar.open('All notifications marked as read', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: () => {
        this.snackBar.open('Failed to mark all as read', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  refreshNotifications(): void {
    this.loadNotifications();
  }
}