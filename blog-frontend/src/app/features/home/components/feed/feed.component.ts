import {
  Component,
  OnInit,
  inject,
  signal,
  Input,
  input,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { Post } from '../../../../core/models/post.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { FeedService } from '../../services/feed.service';
import { UserProfile } from '../../../../core/models/user.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../../core/constants/api.constants';
import { AuthService } from '../../../../core/services/auth.service';
import { InfiniteScrollDirective } from '../../../../shared/directives/infinite-scroll.directive';

@Component({
  selector: 'app-feed',
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatRippleModule,
    MatChipsModule,
    TimeAgoPipe,
    InfiniteScrollDirective,
  ],

  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit {
  private readonly feedService = inject(FeedService);
  private readonly authService = inject(AuthService);


  private readonly router = inject(Router);

  // Computed signals from service
  readonly posts = this.feedService.posts;
  readonly connectedUser = this.authService.currentUser;

  readonly isLoading = this.feedService.isLoading;
  readonly hasMore = this.feedService.hasMore;
  readonly error = this.feedService.error;

  // Local state
  readonly isRefreshing = signal(false);
  readonly isLoadingMore = signal(false);

  ngOnInit(): void {
    console.log('FeedComponent initialized');
    this.feedService.clearFeed();
    this.loadMore();
  }




  refreshFeed(): void {
    this.isRefreshing.set(true);

    this.feedService.refreshFeed();
    this.isRefreshing.set(false);
  }

  readonly user = input<UserProfile | null>();
   
  //@Input() user: UserProfile | null = null;

  loadMore(): void {
    if (this.isLoadingMore()) return;
    console.log('Loading more posts...');
    this.isLoadingMore.set(true);
    if (this.user() != null) {
      console.log('Loading posts for user:', this.user());
      this.feedService.getFeed(
        `${API_ENDPOINTS.USERS.BY_USERNAME}/${this.user()!.username}${API_ENDPOINTS.POSTS.GET_ALL}`
      );
    } else {
      this.feedService.getFeed();
    }


      this.isLoadingMore.set(false);
   
  }

  onLikePost(post: Post, event: Event): void {
    event.stopPropagation();
    this.feedService.toggleLike(post.id, post.isLiked || false).subscribe();
  }

  navigateToPost(postId: number): void {
    this.router.navigate(['/posts', postId]);
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`;
  }

  getAuthorInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }

  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}
