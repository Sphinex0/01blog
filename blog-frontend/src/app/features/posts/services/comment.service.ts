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
  getCommentsByPost(postId: number): Observable<ApiResponse<Comment[]>> {
    return this.http.get<ApiResponse<Comment[]>>(
      `${this.baseUrl}${API_ENDPOINTS.COMMENTS.GET_BY_POST}/${postId}`
    );
  }

  /**
   * Create new comment
   */
  createComment(data: CreateCommentRequest): Observable<ApiResponse<Comment>> {
    return this.http.post<ApiResponse<Comment>>(
      `${this.baseUrl}${API_ENDPOINTS.COMMENTS.CREATE}`,
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
  deleteComment(commentId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.COMMENTS.DELETE}/${commentId}`
    );
  }
}