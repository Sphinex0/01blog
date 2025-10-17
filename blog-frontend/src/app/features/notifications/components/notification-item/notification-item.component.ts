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
  templateUrl: './notification-item.component.html',
  styleUrl: './notification-item.component.scss'
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


    getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080${url}`;
  }

  getAuthorInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}