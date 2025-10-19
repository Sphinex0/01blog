import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, take, tap } from 'rxjs';
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
    // return this.http.get<Comment[]>(
    //   `${this.baseUrl}${API_ENDPOINTS.POSTS.GET_BY_ID}/${postId}/comments`
    // );

    return this.http.get<Comment[]>(`${this.baseUrl}${API_ENDPOINTS.POSTS.GET_BY_ID}/${postId}/comments`).pipe(
      tap(comments => this.buildCommentTree(comments))
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

 /**
   * Like/unlike a comment
   */
  likeComment(commentId: number): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${API_ENDPOINTS.COMMENTS.DELETE}/${commentId}`, {});
  }

  /**
   * Get replies for a specific comment
   */
  getReplies(commentId: number): Observable<Comment[]> {
    return this.http.get<Comment[]>(`${this.baseUrl}${API_ENDPOINTS.COMMENTS.DELETE}/${commentId}`);
  }

   /**
   * Build a tree structure from flat comment list
   * Organizes comments by parent-child relationships
   */
  private buildCommentTree(comments: Comment[]): Comment[] {
    const commentMap = new Map<number, Comment>();
    const rootComments: Comment[] = [];

    // First pass: Create a map of all comments
    comments.forEach(comment => {
      commentMap.set(comment.id, { ...comment, replies: [], depth: 0 });
    });

    // Second pass: Build the tree structure
    comments.forEach(comment => {
      const commentNode = commentMap.get(comment.id)!;

      if (comment.parentId && commentMap.has(comment.parentId)) {
        // This is a reply, add it to parent's replies
        const parent = commentMap.get(comment.parentId)!;
        commentNode.depth = (parent.depth || 0) + 1;
        parent.replies!.push(commentNode);
        parent.repliesCount = (parent.repliesCount || 0) + 1;
      } else {
        // This is a root comment
        rootComments.push(commentNode);
      }
    });

    // Sort root comments by date (newest first)
    rootComments.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    // Sort replies within each comment (oldest first for conversation flow)
    this.sortRepliesRecursively(rootComments);

    return rootComments;
  }

  /**
   * Recursively sort replies within comment tree
   */
  private sortRepliesRecursively(comments: Comment[]): void {
    comments.forEach(comment => {
      if (comment.replies && comment.replies.length > 0) {
        comment.replies.sort((a, b) => 
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        this.sortRepliesRecursively(comment.replies);
      }
    });
  }

  /**
   * Flatten comment tree to array (useful for searching/counting)
   */
  flattenCommentTree(comments: Comment[]): Comment[] {
    const flattened: Comment[] = [];

    const flatten = (commentList: Comment[]) => {
      commentList.forEach(comment => {
        flattened.push(comment);
        if (comment.replies && comment.replies.length > 0) {
          flatten(comment.replies);
        }
      });
    };

    flatten(comments);
    return flattened;
  }

  /**
   * Find a comment by ID in the tree
   */
  findCommentById(comments: Comment[], commentId: number): Comment | null {
    for (const comment of comments) {
      if (comment.id === commentId) {
        return comment;
      }
      if (comment.replies && comment.replies.length > 0) {
        const found = this.findCommentById(comment.replies, commentId);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Get the path to a comment (useful for breadcrumbs in sidebar)
   */
  getCommentPath(comments: Comment[], commentId: number): Comment[] {
    const path: Comment[] = [];

    const findPath = (commentList: Comment[], targetId: number): boolean => {
      for (const comment of commentList) {
        path.push(comment);
        
        if (comment.id === targetId) {
          return true;
        }

        if (comment.replies && comment.replies.length > 0) {
          if (findPath(comment.replies, targetId)) {
            return true;
          }
        }

        path.pop();
      }
      return false;
    };

    findPath(comments, commentId);
    return path;
  }

}