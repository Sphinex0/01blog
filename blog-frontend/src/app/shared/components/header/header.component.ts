import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDividerModule } from '@angular/material/divider';
import { User } from '../../../core/models/user.interface';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationBadgeComponent } from '../../../features/notifications/components/notification-badge/notification-badge.component';
import { ThemeToggleComponent } from '../../../features/settings/components/theme-toggle/theme-toggle.component';
import { API_BASE_URL } from '../../../core/constants/api.constants';

@Component({
  selector: 'app-header',
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    MatDividerModule,
    NotificationBadgeComponent,
    ThemeToggleComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);

  // Inputs
  readonly currentUser = input<User | null>();

  // Outputs
  readonly mobileMenuToggle = output<void>();

  onMenuOpen(): void {
    this.authService.updateUserRole();
  }

  onLogout(): void {
    this.authService.logout();
  }

  onMobileMenuToggle(): void {
    this.mobileMenuToggle.emit();
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `${API_BASE_URL}/${avatar}`;
  }

  getInitials(fullName: string = ''): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}
