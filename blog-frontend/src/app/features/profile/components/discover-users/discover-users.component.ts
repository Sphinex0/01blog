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
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { ProfileService } from '../../services/profile.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { UserCardComponent } from '../user-card/user-card.component';
import { SubscriptionService } from '../../services/subscription.service';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';
import { AuthService } from '../../../../core/services/auth.service';

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
    InfiniteScrollDirective,
  ],
  templateUrl: './discover-users.component.html',
  styleUrl: './discover-users.component.scss',
})
export class DiscoverUsersComponent implements OnInit {
  private readonly profileService = inject(ProfileService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly authService = inject(AuthService);
  readonly currentUser = this.authService.currentUser;

  // State Signals
  readonly users = signal<UserProfile[]>([]);
  readonly isLoading = signal(false);
  readonly cursor = signal(0);
  readonly hasMore = signal(true);
  readonly error = signal<string | null>(null);

  // Search control
  readonly searchControl = new FormControl('');
  private readonly pageSize = 10;

  ngOnInit(): void {
    this.loadUsers(true);
    this.setupSearch();
  }

  private setupSearch(): void {
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe(() => {
        this.users.set([]);
        this.cursor.set(0);
        this.hasMore.set(true);
        this.loadUsers(true);
      });
  }

  loadUsers(isInitialLoad: boolean = false): void {
    if (this.isLoading() || (!this.hasMore() && !isInitialLoad)) {
      return;
    }
    this.isLoading.set(true);
    this.error.set(null);

    const searchTerm = this.searchControl.value?.trim();
    const currentCursor = this.cursor();
    
    let apiCall: Observable<UserProfile[]>;

    // Decide which API endpoint to call based on the search term
    if (searchTerm) {
      apiCall = this.profileService.searchUsers(searchTerm, currentCursor, this.pageSize);
    } else {
      apiCall = this.profileService.getAllUsers(currentCursor);
    }

    apiCall.subscribe({
      next: (response) => {
        if (response && response.length > 0) {
          if (currentCursor === 0) {
            this.users.set(response);
          } else {
            this.users.update((users) => [...users, ...response]);
          }
          this.cursor.set(response[response.length - 1].id);
        }
        
        // If the API returns fewer items than requested, we've reached the end
        this.hasMore.set(response.length === this.pageSize);
        
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

  onFollowToggle(event: { userId: number; isFollowing: boolean }): void {
    this.subscriptionService.TogglefollowUser(event.userId).subscribe({
      next: (response) => {
        let action = response.action;
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
        this.snackBar.open(action === 'subscribed' ? 'Followed successfully' : 'Unfollowed successfully', 'Close', {
          duration: 2000,
          panelClass: ['success-snackbar'],
        });
      },
      error: (err) => {
        this.snackBar.open('Action failed', 'Close', {
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