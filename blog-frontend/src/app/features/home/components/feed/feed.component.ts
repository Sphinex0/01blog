import {
  Component,
  OnInit,
  inject,
  signal,
  HostListener,
  AfterViewInit,
  ViewChild,
  ElementRef,
  OnDestroy,
  effect,
  Directive,
  Output,
  EventEmitter,
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

@Directive({
  selector: '[elementVisible]',
  standalone: true,
})
export class ElementVisibleDirective implements AfterViewInit {
  @Output() elementVisible = new EventEmitter<void>();

  private observer?: IntersectionObserver;
  private readonly elementRef = inject(ElementRef);

  ngAfterViewInit(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.elementVisible.emit();
          }
        });
      },
      {
        root: null,
        rootMargin: '300px',
        threshold: 0.1,
      }
    );

    this.observer.observe(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}

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
    ElementVisibleDirective,
  ],
  host: {
    '(window:scroll)': 'onScroll()',
  },
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements OnInit, OnDestroy {
  private readonly feedService = inject(FeedService);
  private observer?: IntersectionObserver;

  @ViewChild('loadMoreTrigger') loadMoreTrigger?: ElementRef;

  private readonly router = inject(Router);


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
  ngOnDestroy(): void {
    this.observer?.disconnect();
  }

  onTriggerVisible(): void {
    if (this.hasMore() && !this.isLoading() && !this.isLoadingMore()) {
      this.loadMore();
    }
  }
  private setupIntersectionObserver(): void {
    const options = {
      root: null,
      rootMargin: '300px',
      threshold: 0.1,
    };
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        console.log('IntersectionObserver entry:', entry);
        if (entry.isIntersecting && this.hasMore() && !this.isLoading() && !this.isLoadingMore()) {
          this.loadMore();
        }
      });
    }, options);
    if (this.loadMoreTrigger) {
      this.observer.observe(this.loadMoreTrigger.nativeElement);
    }
  }

  // @HostListener('window:scroll')
  onScroll(): void {
    console.log('scrolling...');
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
      },
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
    this.router.navigate(['/posts', postId]);
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
