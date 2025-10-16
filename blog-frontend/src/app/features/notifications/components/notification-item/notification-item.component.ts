import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { Notification } from '../../../../core/models/notification.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
// import { TimeAgoPipe } from '../../../../shared/pipes/time-ago.pipe';

@Component({
  selector: 'app-notification-item',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatRippleModule,
    TimeAgoPipe,
  ],
  template: `
    <div 
      class="notification-item"
      [class.unread]="!notification().read"
      (click)="onNotificationClick()"
      matRipple>
      
      <!-- Icon -->
      <div class="notification-icon" [class]="getNotificationType()">
        <mat-icon>{{ getNotificationIcon() }}</mat-icon>
      </div>

      <!-- Content -->
      <div class="notification-content">
        <p class="notification-message"> new post created by @{{ notification().sender.username }}</p>
         <!-- notification().message -->
        <span class="notification-time">{{ notification().createdAt | timeAgo }}</span>
      </div>

      <!-- Unread Indicator -->
      @if (!notification().read) {
        <div class="unread-dot"></div>
      }

      <!-- Menu -->
      <button 
        mat-icon-button 
        [matMenuTriggerFor]="menu" 
        class="menu-btn"
        (click)="$event.stopPropagation()">
        <mat-icon>more_vert</mat-icon>
      </button>

      <mat-menu #menu="matMenu">
        @if (!notification().read) {
          <button mat-menu-item (click)="onMarkAsRead()">
            <mat-icon>done</mat-icon>
            <span>Mark as read</span>
          </button>
        }
        <button mat-menu-item (click)="onDelete()" class="delete-item">
          <mat-icon>delete</mat-icon>
          <span>Delete</span>
        </button>
      </mat-menu>
    </div>
  `,
  styles: [`
    .notification-item {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem;
      cursor: pointer;
      position: relative;
      transition: background 0.2s ease;

      &:hover {
        background: #f9fafb;
      }

      &.unread {
        background: #eff6ff;

        &:hover {
          background: #dbeafe;
        }
      }
    }

    .notification-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &.like {
        background: #fee2e2;
        mat-icon { color: #ef4444; }
      }

      &.comment {
        background: #dbeafe;
        mat-icon { color: #3b82f6; }
      }

      &.follow {
        background: #dcfce7;
        mat-icon { color: #22c55e; }
      }

      &.new_post {
        background: #fef3c7;
        mat-icon { color: #f59e0b; }
      }

      mat-icon {
        font-size: 1.25rem;
        width: 1.25rem;
        height: 1.25rem;
      }
    }

    .notification-content {
      flex: 1;
      min-width: 0;
    }

    .notification-message {
      margin: 0 0 0.25rem;
      font-size: 0.9375rem;
      color: #1a1a1a;
      line-height: 1.5;
    }

    .notification-time {
      font-size: 0.8125rem;
      color: #9ca3af;
    }

    .unread-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #3b82f6;
      flex-shrink: 0;
    }

    .menu-btn {
      flex-shrink: 0;
      color: #6b7280;
      opacity: 0;
      transition: opacity 0.2s ease;

      .notification-item:hover & {
        opacity: 1;
      }
    }

    .delete-item {
      color: #ef4444;

      mat-icon {
        color: #ef4444;
      }
    }

    // Dark mode
    @media (prefers-color-scheme: dark) {
      .notification-item {
        &:hover {
          background: #2a2a2a;
        }

        &.unread {
          background: #1e3a5f;

          &:hover {
            background: #1e4976;
          }
        }
      }

      .notification-message {
        color: #e0e0e0;
      }

      .notification-time {
        color: #9ca3af;
      }
    }
  `]
})
export class NotificationItemComponent {
  readonly notification = input.required<Notification>();
  readonly clicked = output<Notification>();
  readonly markAsRead = output<number>();
  readonly delete = output<number>();

  onNotificationClick(): void {
    this.clicked.emit(this.notification());
  }

  onMarkAsRead(): void {
    this.markAsRead.emit(this.notification().id);
  }

  onDelete(): void {
    this.delete.emit(this.notification().id);
  }

  getNotificationType(): string {
    // return this.notification().type;
    return 'new_post';
  }

  getNotificationIcon(): string {
    // const type = this.notification().type;
    const type = 'new_post';
    const iconMap: Record<string, string> = {
      like: 'favorite',
      comment: 'comment',
      follow: 'person_add',
      new_post: 'article'
    };
    return iconMap[type] || 'notifications';
  }
}