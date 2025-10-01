import { Component, OnInit, inject, signal, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRippleModule } from '@angular/material/core';
import { MatChipsModule } from '@angular/material/chips';
import { Post } from '../../../../core/models/post.interface';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { FeedService } from '../../services/feed.service';

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
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  private readonly feedService = inject(FeedService);

  // Computed signals from service
  readonly posts = this.feedService.posts;
  readonly isLoading = this.feedService.isLoading;
  readonly hasMore = this.feedService.hasMore;
  readonly error = this.feedService.error;

  // Local state
  readonly isRefreshing = signal(false);
  readonly isLoadingMore = signal(false);

  // Infinite scroll state
  private scrollThreshold = 300; // pixels from bottom to trigger load

  ngOnInit(): void {
    this.loadFeed();
  }

@HostListener('window:scroll')
onScroll(): void {
  if (this.shouldLoadMore()) {
    this.loadMore();
  }
}

  private shouldLoadMore(): boolean {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.documentElement.scrollHeight;
    const distanceFromBottom = documentHeight - scrollPosition;

    return (
      distanceFromBottom < this.scrollThreshold &&
      !this.isLoading() &&
      !this.isLoadingMore() &&
      this.hasMore() &&
      this.posts().length > 0
    );
  }

  loadFeed(): void {
    this.feedService.getFeed().subscribe();
  }

  refreshFeed(): void {
    this.isRefreshing.set(true);
    
    this.feedService.refreshFeed().subscribe({
      next: () => {
        this.isRefreshing.set(false);
      },
      error: () => {
        this.isRefreshing.set(false);
      }
    });
  }

  loadMore(): void {
    if (this.isLoadingMore()) return;
    
    this.isLoadingMore.set(true);
    this.feedService.loadMore();
    
    // Reset loading state after a delay
    setTimeout(() => {
      this.isLoadingMore.set(false);
    }, 500);
  }

  onLikePost(post: Post, event: Event): void {
    event.stopPropagation();
    this.feedService.toggleLike(post.id, post.isLiked || false).subscribe();
  }

  navigateToPost(postId: number): void {
    // Will navigate to post detail
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

  trackByPostId(index: number, post: Post): number {
    return post.id;
  }
}