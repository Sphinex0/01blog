import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
// import { SubscriptionService } from '../../services/subscription.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { UserCardComponent } from '../user-card/user-card.component';
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-discover-users',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatChipsModule,
    UserCardComponent,
  ],
  templateUrl: './discover-users.component.html',
  styleUrl: './discover-users.component.scss',
})
export class DiscoverUsersComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly users = signal<UserProfile[]>([]);
  readonly isLoading = signal(false);
  readonly cursor = signal(0);
  readonly hasMore = signal(true);
  readonly error = signal<string | null>(null);

  // Search control
  readonly searchControl = new FormControl('');

  ngOnInit(): void {
    this.loadUsers();
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe((searchTerm) => {
        if (searchTerm && searchTerm.trim()) {
          this.searchUsers(searchTerm.trim());
        } else {
          this.loadUsers();
        }
      });
  }

  onTriggerVisible(): void {
    if (this.hasMore() && !this.isLoading() && this.error() === null) {
      setTimeout(() => {
        this.loadUsers();
      }, 0);
    }
  }

  loadUsers(): void {
    if (this.isLoading()) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);

    this.profileService.getAllUsers(this.cursor()).subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          if (this.cursor() === 0) {
            this.users.set(response);
          } else {
            this.users.update((users) => [...users, ...response]);
          }
          this.cursor.set(response[response.length - 1].id);
        }

        if (response.length === 0) {
          this.hasMore.set(false);
        }
        
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load users');
        this.isLoading.set(false);
        this.snackBar.open('Failed to load users', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  searchUsers(searchTerm: string): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.profileService.searchUsers(searchTerm).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users.set(response.data);
        }
        this.isLoading.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Search failed');
        this.isLoading.set(false);
      },
    });
  }

  onFollowToggle(event: { userId: number; isFollowing: boolean }): void {
    // Follow
    this.subscriptionService.TogglefollowUser(event.userId).subscribe({
      next: (response) => {
        // Update user in list
        let action = response.action;
        console.log('Response from follow API:', response);
        this.users.update((users) =>
          users.map((user) =>
            user.id === event.userId
              ? {
                  ...user,
                  isFollowed: action === 'subscribed',
                  followersCount: (user.followersCount || 0) + (action === 'subscribed' ? 1 : -1),
                }
              : user
          )
        );
        this.snackBar.open('Following successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        console.log('here', err);
        this.snackBar.open('Failed to follow user', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  clearSearch(): void {
    this.searchControl.setValue('');
  }
}
