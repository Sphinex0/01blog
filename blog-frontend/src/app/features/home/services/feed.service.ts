import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Post } from '../../../core/models/post.interface';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  // Signals for state management
  private readonly _posts = signal<Post[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _hasMore = signal<boolean>(true);
  private readonly __currentCursor = signal<number>(0);
  private readonly _error = signal<string | null>(null);

  // Public computed signals
  readonly posts = computed(() => this._posts());
  readonly isLoading = computed(() => this._isLoading());
  readonly hasMore = computed(() => this._hasMore());
  readonly error = computed(() => this._error());

  /**
   * Fetch personalized feed from followed users
   */
  getFeed(endpoint: string | undefined = undefined): void {
    this._isLoading.set(true);
    this._error.set(null);

    const params = new HttpParams().set('cursor', this.__currentCursor().toString());
    let url = endpoint ? endpoint : API_ENDPOINTS.POSTS.FEED;
    this.http.get<Post[]>(`${this.baseUrl}${url}`, { params }).subscribe({
      next: (response: Post[]) => {
        if (response) {
          const paginatedData = response;

          // Append or replace posts based on page number
          if (this.__currentCursor() === 0) {
            this._posts.set(paginatedData);
          } else {
            this._posts.update((current) => [...current, ...paginatedData]);
          }

          this._hasMore.set(paginatedData.length != 0);
          this.__currentCursor.set(
            paginatedData[paginatedData.length - 1]?.id || this.__currentCursor()
          );
        }
        this._isLoading.set(false);
      },
      error: (error) => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load feed');
        return throwError(() => error);
      },
    });
  }

  /**
   * Load next page of posts
   */
  // loadMore(): void {
  //   if (!this._isLoading() && this._hasMore()) {
  //     this.getFeed().subscribe();
  //   }
  // }

  /**
   * Refresh feed (pull-to-refresh)
   */
  refreshFeed(): void {
    this.__currentCursor.set(0);
    this.getFeed();
  }

  /**
   * Like a post
   */
  likePost(postId: number): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`, {})
      .pipe(
        tap(() => {
          // Update post in local state
          this._posts.update((posts) =>
            posts.map((post) =>
              post.id === postId
                ? { ...post, isLiked: true, likesCount: post.likesCount + 1 }
                : post
            )
          );
        })
      );
  }

  /**
   * Unlike a post
   */
  unlikePost(postId: number): Observable<ApiResponse<void>> {
    return this.http
      .post<ApiResponse<void>>(`${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`, {})
      .pipe(
        tap(() => {
          // Update post in local state
          this._posts.update((posts) =>
            posts.map((post) =>
              post.id === postId
                ? { ...post, isLiked: false, likesCount: Math.max(0, post.likesCount - 1) }
                : post
            )
          );
        })
      );
  }

  /**
   * Toggle like on a post
   */
  toggleLike(postId: number, isCurrentlyLiked: boolean): Observable<ApiResponse<void>> {
    return isCurrentlyLiked ? this.unlikePost(postId) : this.likePost(postId);
  }

  /**
   * Get all posts (public feed)
   */
  getAllPosts(page: number = 1): Observable<ApiResponse<PaginatedResponse<Post>>> {
    const params = new HttpParams().set('page', page.toString());
    return this.http.get<ApiResponse<PaginatedResponse<Post>>>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.GET_ALL}`,
      { params }
    );
  }

  /**
   * Clear feed state
   */
  clearFeed(): void {
    this._posts.set([]);
    this.__currentCursor.set(1);
    this._hasMore.set(true);
    this._error.set(null);
  }

  /**
   * Update post in feed after edit
   */
  updatePostInFeed(updatedPost: Post): void {
    this._posts.update((posts) =>
      posts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    );
  }

  /**
   * Remove post from feed after delete
   */
  removePostFromFeed(postId: number): void {
    this._posts.update((posts) => posts.filter((post) => post.id !== postId));
  }
}
