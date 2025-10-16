import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationApiService } from '../../services/notification-api.service';

@Component({
  selector: 'app-notification-badge',
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatBadgeModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  template: `
    <a 
      mat-icon-button 
      routerLink="/notifications"
      routerLinkActive="active"
      matTooltip="Notifications"
      class="notification-badge-btn">
      <mat-icon 
        [matBadge]="unreadCount() > 0 ? unreadCount() : null"
        [matBadgeHidden]="unreadCount() === 0"
        matBadgeColor="warn"
        matBadgeSize="small">
        notifications
      </mat-icon>
    </a>
  `,
  styles: [`
    .notification-badge-btn {
      position: relative;

      &.active {
        color: #667eea;
      }
    }

    :host ::ng-deep {
      .mat-badge-content {
        font-weight: 600;
        font-size: 0.625rem;
      }
    }
  `]
})
export class NotificationBadgeComponent implements OnInit {
  private readonly notificationService = inject(NotificationApiService);

  readonly unreadCount = this.notificationService.unreadCount;

  ngOnInit(): void {
    // Load initial unread count
    this.notificationService.getUnreadCount().subscribe();

    // Poll for updates every 30 seconds (optional)
    // You can implement WebSocket for real-time updates instead
    // setInterval(() => {
    //   this.notificationService.getUnreadCount().subscribe();
    // }, 30000);
  }
}