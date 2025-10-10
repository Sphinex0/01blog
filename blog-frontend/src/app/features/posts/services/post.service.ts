import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePostRequest, UpdatePostRequest } from '../../../core/models/post.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  /**
   * Get post by ID
   */
  getPostById(postId: number): Observable<Post> {
    return this.http.get<Post>(`${this.baseUrl}${API_ENDPOINTS.POSTS.GET_BY_ID}/${postId}`);
  }

  /**
   * Create new post
   */
  savePost(data: CreatePostRequest): Observable<Post> {
    // const formData = new FormData();
    // formData.append('title', data.title);
    // formData.append('content', data.content);

    return this.http.post<Post>(`${this.baseUrl}${API_ENDPOINTS.POSTS.CREATE}`, data);
  }

  /**
   * Update existing post
   */
  updatePost(postId: number, data: UpdatePostRequest): Observable<Post> {
    return this.http.put<Post>(`${this.baseUrl}${API_ENDPOINTS.POSTS.UPDATE}/${postId}`, data);
  }

  /**
   * Delete post
   */
  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.POSTS.DELETE}/${postId}`);
  }

  /**
   * Like a post
   */
  likePost(postId: number): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`,
      {}
    );
  }

  /**
   * Unlike a post
   */
  // unlikePost(postId: number): Observable<ApiResponse<void>> {
  //   return this.http.delete<ApiResponse<void>>(
  //     `${this.baseUrl}${API_ENDPOINTS.POSTS.UNLIKE}/${postId}`
  //   );
  // }

  /**
   * Toggle like on a post
   */
  // toggleLike(postId: number, isCurrentlyLiked: boolean): Observable<ApiResponse<void>> {
  //   return isCurrentlyLiked ? this.unlikePost(postId) : this.likePost(postId);
  // }

  /**
   * Get posts by user
   */
  getPostsByUser(userId: number): Observable<ApiResponse<Post[]>> {
    return this.http.get<ApiResponse<Post[]>>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.BY_USER}/${userId}`
    );
  }

  uploadFile(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(
      `${this.baseUrl}${API_ENDPOINTS.MEDIA.UPLOAD}`,
      formData
    );
    // return new Observable<{ url: string }>();
  }
}
