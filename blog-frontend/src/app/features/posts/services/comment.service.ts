import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comment, CreateCommentRequest } from '../../../core/models/comment.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  /**
   * Get comments by post ID
   */
  getCommentsByPost(postId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.GET_BY_ID}/${postId}/comments`
    );
  }

  /**
   * Create new comment
   */
  createComment(postId: number,data: CreateCommentRequest): Observable<Comment> {
    return this.http.post<Comment>(
      `${this.baseUrl}${API_ENDPOINTS.POSTS.GET_BY_ID}/${postId}/comments`,
      data
    );
  }

  /**
   * Update comment
   */
  updateComment(commentId: number, content: string): Observable<ApiResponse<Comment>> {
    return this.http.put<ApiResponse<Comment>>(
      `${this.baseUrl}${API_ENDPOINTS.COMMENTS.UPDATE}/${commentId}`,
      { content }
    );
  }

  /**
   * Delete comment
   */
  deleteComment(commentId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.COMMENTS.DELETE}/${commentId}`
    );
  }
}