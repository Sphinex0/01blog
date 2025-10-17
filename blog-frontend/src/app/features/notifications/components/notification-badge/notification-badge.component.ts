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
      <span 
        [matBadge]="unreadCount() > 0 ? unreadCount() : null"
        [matBadgeHidden]="unreadCount() === 0"
        matBadgeColor="warn"
        matBadgeSize="small">
        <svg width="20" viewBox="0 0 20 20" class="fill-current"><path d="M12 19H8V17H12V19Z"></path><path d="M18 15H2V13H18V15Z"></path><path d="M14 4H6V2H14V4Z"></path><path d="M8 17H6V15H8V17Z"></path><path d="M4 13H2V11H4V13Z"></path><path d="M18 13H16V11H18V13Z"></path><path d="M14 17H12V15H14V17Z"></path><path d="M6 11H4V4H6V11Z"></path><path d="M16 11H14V4H16V11Z"></path></svg>
      </span>
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
    // this.notificationService.getUnreadCount().subscribe();

    // Poll for updates every 30 seconds (optional)
    // You can implement WebSocket for real-time updates instead
    // setInterval(() => {
    //   this.notificationService.getUnreadCount().subscribe();
    // }, 30000);
  }
}