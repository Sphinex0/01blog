import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ProfileService } from '../../services/profile.service';
import { SubscriptionService } from '../../services/subscription.service';
import { PostService } from '../../../posts/services/post.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { Post } from '../../../../core/models/post.interface';
import { ProfileHeaderComponent } from '../profile-header/profile-header.component';
import { FeedComponent } from '../../../home/components/feed/feed.component';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatIconModule,
    ProfileHeaderComponent,
    FeedComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly profileService = inject(ProfileService);
  private readonly subscriptionService = inject(SubscriptionService);
  private readonly postService = inject(PostService);
  private readonly snackBar = inject(MatSnackBar);

  // Signals
  readonly user = signal<UserProfile | null>(null);
  readonly posts = signal<Post[]>([]);
  readonly isLoadingProfile = signal(false);
  readonly isLoadingPosts = signal(false);
  readonly isFollowLoading = signal(false);
  readonly error = signal<string | null>(null);

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const username = params['username'];
      this.loadProfile(username);
    });
  }

  loadProfile(username: string): void {
    this.isLoadingProfile.set(true);
    this.error.set(null);

    this.profileService.getUserByUsername(username).subscribe({
      next: (response) => {
        if (response) {
          this.user.set(response);
          // this.loadUserPosts(response.id);
        }
        this.isLoadingProfile.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load profile');
        this.isLoadingProfile.set(false);
        this.snackBar.open('Failed to load profile', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }



  loadUserPosts(userId: number): void {
    this.isLoadingPosts.set(true);

    this.postService.getPostsByUser(userId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.posts.set(response.data);
        }
        this.isLoadingPosts.set(false);
      },
      error: (err) => {
        console.error('Failed to load posts:', err);
        this.isLoadingPosts.set(false);
      }
    });
  }

  onFollowToggle(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    this.isFollowLoading.set(true);
    const isFollowed = currentUser.isFollowed || false;

    const action = this.subscriptionService.TogglefollowUser(currentUser.id);

    action.subscribe({
      next: () => {
        // Update user locally
        this.user.update(user => {
          if (!user) return user;
          return {
            ...user,
            isFollowed: !isFollowed,
            followersCount: isFollowed 
              ? Math.max(0, user.followersCount! - 1)
              : (user.followersCount || 0) + 1
          };
        });

        this.snackBar.open(
          isFollowed ? 'Unfollowed successfully' : 'Following successfully',
          'Close',
          { duration: 2000, panelClass: ['success-snackbar'] }
        );
        this.isFollowLoading.set(false);
      },
      error: () => {
        this.snackBar.open('Action failed', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
        this.isFollowLoading.set(false);
      }
    });
  }

  onEditProfile(): void {
    this.router.navigate(['/profile/edit']);
  }

  onShareProfile(): void {
    const currentUser = this.user();
    if (!currentUser) return;

    const url = `${window.location.origin}/profile/${currentUser.username}`;
    
    if (navigator.share) {
      navigator.share({
        title: `${currentUser.fullName}'s Profile`,
        text: `Check out ${currentUser.fullName}'s profile on 01Blog`,
        url: url
      }).catch(() => this.copyProfileLink(url));
    } else {
      this.copyProfileLink(url);
    }
  }

  onReportUser(): void {
    // TODO: Implement report dialog
    this.snackBar.open('Report feature coming soon', 'Close', {
      duration: 2000
    });
  }

  private copyProfileLink(url: string): void {
    navigator.clipboard.writeText(url).then(() => {
      this.snackBar.open('Profile link copied to clipboard!', 'Close', {
        duration: 2000,
        panelClass: ['success-snackbar']
      });
    });
  }

  goBack(): void {
    this.router.navigate(['/home']);
  }
}