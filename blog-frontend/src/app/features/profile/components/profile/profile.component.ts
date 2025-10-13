import { Component, inject, OnInit, signal } from '@angular/core';
import { ProfileHeaderComponent } from "../profile-header/profile-header.component";
import { ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { FeedComponent } from "../../../home/components/feed/feed.component";
import { SubscriptionService } from '../../services/subscription.service';

@Component({
  selector: 'app-profile',
  imports: [ProfileHeaderComponent, FeedComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly profileService = inject(ProfileService);
    private readonly subscriptionService = inject(SubscriptionService);
  

  readonly user = signal<UserProfile | null>(null);
  
  onFollowToggle(): void {
    const userId = this.user()?.id;
    if (!userId) return;

    this.subscriptionService.TogglefollowUser(userId).subscribe({
      next: (response) => {
        const currentUser = this.user();
        if (currentUser) {
          if (response.action === 'subscribed') {
            currentUser.followersCount += 1;
            currentUser.isFollowed = true;
          } else if (response.action === 'unsubscribed') {
            currentUser.followersCount -= 1;
            currentUser.isFollowed = false;
          }
          this.user.set({ ...currentUser });
        }
      },
      error: (err) => {
        console.error('Error toggling follow status:', err);
      }
    });
  }
  
  ngOnInit(): void {
    // Fetch user profile based on route param
    const username = this.route.snapshot.paramMap.get('username');
    if (username) {
      this.profileService.getUserByUsername(username).subscribe({
        next: (profile) => {
          console.log(profile);
          this.user.set(profile)
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          // Handle error, e.g., navigate to a not-found page
        }
      });
    }
  }

}
