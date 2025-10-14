import { Component, input, output, computed, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { UserProfile } from '../../../../core/models/user.interface';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-profile-header',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule,
    MatChipsModule,
  ],
  templateUrl: './profile-header.component.html',
  styleUrl: './profile-header.component.scss'
})
export class ProfileHeaderComponent {
  private readonly authService = inject(AuthService);

  // Inputs
  readonly user = input.required<UserProfile | null>();
  readonly isLoading = input(false);

  // Outputs
  readonly followToggle = output<void>();
  readonly editProfile = output<void>();
  readonly shareProfile = output<void>();
  readonly reportUser = output<void>();

  // Computed
  readonly currentUser = this.authService.currentUser;
  readonly isOwnProfile = computed(() => {
    const current = this.currentUser();
    const profile = this.user();
    return current?.id === profile?.id;
  });

  onFollowToggle(): void {
    this.followToggle.emit();
  }

  onEditProfile(): void {
    this.editProfile.emit();
  }

  onShareProfile(): void {
    this.shareProfile.emit();
  }

  onReportUser(): void {
    this.reportUser.emit();
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:8080${avatar}`;
  }

  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      // Handle avatar upload logic here
      console.log('Selected avatar file:', file);
    }
  }

  getInitials(fullName: string=""): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }

  getCoverGradient(): string {
    // Generate a unique gradient based on username
    const username = this.user()?.username || '';
    const hash = username.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const hue1 = hash % 360;
    const hue2 = (hash + 60) % 360;
    return `linear-gradient(135deg, hsl(${hue1}, 70%, 60%) 0%, hsl(${hue2}, 70%, 50%) 100%)`;
  }
}