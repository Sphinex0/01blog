import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { PaginatedResponse } from '../../../core/models/api-response.interface';
import { AdminUserDetails } from '../../../core/models/user.interface';
import { AdminPost } from '../../../core/models/post.interface';
import { Report } from '../../../core/models/report.interface';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  // Users Management
  getAllUsers(page: number = 0, size: number = 10, search?: string): Observable<AdminUserDetails[]> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<AdminUserDetails[]>(
      `${this.baseUrl}/users`,
      { params }
    );
  }

  getUserById(userId: number): Observable<AdminUserDetails> {
    return this.http.get<AdminUserDetails>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GET_USER}/${userId}`
    );
  }

  banUser(userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.BAN_USER}/${userId}`,
      {}
    );
  }

  unbanUser(userId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UNBAN_USER}/${userId}`,
      {}
    );
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DELETE_USER}/${userId}`
    );
  }

  // Posts Management
  getAllPosts(page: number = 0, size: number = 12, search?: string): Observable<PaginatedResponse<AdminPost>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<PaginatedResponse<AdminPost>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.POSTS}`,
      { params }
    );
  }

  getPostById(postId: number): Observable<AdminPost> {
    return this.http.get<AdminPost>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GET_POST}/${postId}`
    );
  }

  hidePost(postId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.HIDE_POST}/${postId}`,
      {}
    );
  }

  unhidePost(postId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.UNHIDE_POST}/${postId}`,
      {}
    );
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DELETE_POST}/${postId}`
    );
  }

  // Reports Management
  getAllReports(page: number = 0, size: number = 10, status?: string): Observable<PaginatedResponse<Report>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    
    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<PaginatedResponse<Report>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.REPORTS}`,
      { params }
    );
  }

  resolveReport(reportId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.RESOLVE_REPORT}/${reportId}`,
      {}
    );
  }

  dismissReport(reportId: number): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DISMISS_REPORT}/${reportId}`,
      {}
    );
  }

  deleteReport(reportId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.DELETE_REPORT}/${reportId}`
    );
  }
}
