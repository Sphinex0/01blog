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
  templateUrl: './notification-badge.component.html',
  styleUrl: './notification-badge.component.scss'
})
export class NotificationBadgeComponent implements OnInit {
  private readonly notificationService = inject(NotificationApiService);

  readonly unreadCount = this.notificationService.unreadCount;

  ngOnInit(): void {
    // Load initial unread count
    this.notificationService.getUnreadCount().subscribe();
    console.log('NotificationBadgeComponent initialized', this.unreadCount());
    // Poll for updates every 30 seconds (optional)
    // You can implement WebSocket for real-time updates instead
    // setInterval(() => {
    //   this.notificationService.getUnreadCount().subscribe();
    // }, 30000);
  }
}