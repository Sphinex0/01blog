import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { UserProfile } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-user-card',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './user-card.component.html',
  styleUrl:'./user-card.component.scss',
})
export class UserCardComponent {
  readonly user = input.required<UserProfile>();
  readonly followToggle = output<{ userId: number; isFollowing: boolean }>();

  onFollow(): void {
    this.followToggle.emit({ 
      userId: this.user().id, 
      isFollowing: false 
    });
  }

  onUnfollow(): void {
    this.followToggle.emit({ 
      userId: this.user().id, 
      isFollowing: true 
    });
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:8080${avatar}`;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}