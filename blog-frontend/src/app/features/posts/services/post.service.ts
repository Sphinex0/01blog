import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Post, CreatePostRequest, UpdatePostRequest } from '../../../core/models/post.interface';
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
  deletePost(postId: number): Observable<string> {
    return this.http.delete(`${this.baseUrl}${API_ENDPOINTS.POSTS.DELETE}/${postId}`, { responseType: 'text' });
  }

  /**
   * Like a post
   */
  likePost(postId: number): Observable<number> {
    return this.http.post<number>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.LIKE}/${postId}`,
      {}
    );
  }

  
  getPostsByUser(userId: number): Observable<Post[]> {
    return this.http.get<Post[]>(
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
