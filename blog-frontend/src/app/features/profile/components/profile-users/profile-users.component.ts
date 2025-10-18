import { Component, OnInit, computed, effect, inject, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatListModule } from '@angular/material/list';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ProfileService } from '../../services/profile.service';
import { SubscriptionService } from '../../services/subscription.service';
import { AuthService } from '../../../../core/services/auth.service';
import { UserProfile } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-profile-users',
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatListModule,
    MatDividerModule,
  ],
  templateUrl: './profile-users.component.html',
  styleUrl: './profile-users.component.scss',
})
export class ProfileUsersComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  // readonly followers = signal<UserProfile[]>([]);
  readonly error = signal<string | null>(null);
  readonly username = signal<string>('');
  readonly currentUser = this.authService.currentUser;

  readonly isLoading = signal(false);
  readonly cursor = signal(0);
  readonly hasMore = signal(true);

  readonly users = signal<UserProfile[]>([]);

  readonly isFollowers = input.required<boolean>();

  ngOnInit(): void {
    console.log('loading followers list eeeee', this.users());
    this.route.params.subscribe((params) => {
      const username = params['username'];
      if (username) {
        this.username.set(username);
        this.loadFollowers();
      }
    });
  }

  onTriggerVisible(): void {
    if (this.isLoading()) return;
    if (!this.hasMore()) return;
    setTimeout(() => {
      this.loadFollowers();
    }, 0);

  }

  loadFollowers(): void {
    if (this.isLoading()) {
      return;
    }
    const username = this.username();
    this.isLoading.set(true);
    this.error.set(null);

    // First get the user to get their ID
    this.profileService.getUserByUsername(username).subscribe({
      next: (response) => {
        if (response) {
          const userId = response.id;
          // Then get followers
          let getter = this.isFollowers() ? this.profileService.getFollowers(userId, this.cursor()) : this.profileService.getFollowing(userId, this.cursor());

          getter.subscribe({
            next: (followersResponse) => {
              if (followersResponse) {
                if (followersResponse.length === 0) {
                  this.hasMore.set(false);
                } else {
                  if (this.cursor() === 0) {
                    this.users.set(followersResponse);
                  } else {
                    this.users.update((users) => [...users, ...followersResponse]);
                  }
                  this.cursor.set(followersResponse[followersResponse.length - 1].id);
                }
              }

              this.isLoading.set(false);
            },
            error: (err) => {
              this.error.set('Failed to load followers');
              this.isLoading.set(false);
            },
          });
        }
      },
      error: (err) => {
        this.error.set('User not found');
        this.isLoading.set(false);
      },
    });
  }

  onFollowToggle(user: UserProfile): void {
    const isFollowed = user.isFollowed || false;

    const action = this.subscriptionService.TogglefollowUser(user.id);

    action.subscribe({
      next: () => {
        // Update user in list
        this.users.update((users) =>
          users.map((u) => (u.id === user.id ? { ...u, isFollowed: !isFollowed } : u))
        );

        this.snackBar.open(
          isFollowed ? 'Unfollowed successfully' : 'Following successfully',
          'Close',
          { duration: 2000, panelClass: ['success-snackbar'] }
        );
      },
      error: () => {
        this.snackBar.open('Action failed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  isCurrentUser(userId: number): boolean {
    return this.currentUser()?.id === userId;
  }

  goBack(): void {
    this.router.navigate(['/users/profile', this.username()]);
  }

  getAvatarUrl(avatar: string | undefined): string {
    if (!avatar) return '';
    if (avatar.startsWith('http')) return avatar;
    return `http://localhost:8080/api/${avatar}`;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}
