import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Post } from '../../../core/models/post.interface';
import { ApiResponse, PaginatedResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { APP_CONSTANTS } from '../../../core/constants/app.constants';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  // Signals for state management
  private readonly _posts = signal<Post[]>([]);
  private readonly _isLoading = signal<boolean>(false);
  private readonly _hasMore = signal<boolean>(true);
  private readonly _currentPage = signal<number>(1);
  private readonly _error = signal<string | null>(null);

  // Public computed signals
  readonly posts = computed(() => this._posts());
  readonly isLoading = computed(() => this._isLoading());
  readonly hasMore = computed(() => this._hasMore());
  readonly currentPage = computed(() => this._currentPage());
  readonly error = computed(() => this._error());

  /**
   * Fetch personalized feed from followed users
   */
  getFeed(page: number = 1, limit: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE): Observable<Post[]> {
    this._isLoading.set(true);
    this._error.set(null);

    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    return this.http.get<Post[]>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.FEED}`,
      { params }
    ).pipe(
      tap((response) => {
        if (response) {
          const paginatedData = response;
          
          // Append or replace posts based on page number
          if (page === 1) {
            this._posts.set(paginatedData);
          } else {
            this._posts.update(current => [...current, ...paginatedData]);
          }

          this._hasMore.set(paginatedData.length != 0);
          this._currentPage.set(page);
        }
        this._isLoading.set(false);
        console.log("vvvvvvvvvvvvvvv")
        console.log(this._posts(),"<<<<<<<<<<")
        // console.log(response,7451)
      }),
      catchError((error) => {
        this._isLoading.set(false);
        this._error.set(error.error?.message || 'Failed to load feed');
        return throwError(() => error);
      })
    );
  }

  /**
   * Load next page of posts
   */
  loadMore(): void {
    if (!this._isLoading() && this._hasMore()) {
      const nextPage = this._currentPage() + 1;
      this.getFeed(nextPage).subscribe();
    }
  }

  /**
   * Refresh feed (pull-to-refresh)
   */
  refreshFeed(): Observable<Post[]> {
    this._currentPage.set(1);
    return this.getFeed(1);
  }

  /**
   * Like a post
   */
  likePost(postId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`,
      {}
    ).pipe(
      tap(() => {
        // Update post in local state
        this._posts.update(posts =>
          posts.map(post =>
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
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`,
      {}
    ).pipe(
      tap(() => {
        // Update post in local state
        this._posts.update(posts =>
          posts.map(post =>
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
  getAllPosts(page: number = 1, limit: number = APP_CONSTANTS.PAGINATION.DEFAULT_PAGE_SIZE): Observable<ApiResponse<PaginatedResponse<Post>>> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

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
    this._currentPage.set(1);
    this._hasMore.set(true);
    this._error.set(null);
  }

  /**
   * Update post in feed after edit
   */
  updatePostInFeed(updatedPost: Post): void {
    this._posts.update(posts =>
      posts.map(post => post.id === updatedPost.id ? updatedPost : post)
    );
  }

  /**
   * Remove post from feed after delete
   */
  removePostFromFeed(postId: number): void {
    this._posts.update(posts => posts.filter(post => post.id !== postId));
  }
}