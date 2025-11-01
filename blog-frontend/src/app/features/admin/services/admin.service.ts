import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
// Import only necessary models
import { AdminUserDetails } from '../../../core/models/user.interface';
import { AdminPost } from '../../../core/models/post.interface';
import { Report } from '../../../core/models/report.interface';

export interface BanRequestPayload {
  id: number;
  until: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;


  getAllUsers(
    cursor: number = 0,
    search?: string
  ): Observable<AdminUserDetails[]> {
    let params = new HttpParams()
      .set('cursor', cursor.toString()) 

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<AdminUserDetails[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS}`, {
      params,
    });
  }

  getUserById(userId: number): Observable<AdminUserDetails> {
    return this.http.get<AdminUserDetails>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GET_USER}/${userId}`
    );
  }

  /**
   * Bans a user until a specific date or lifts the ban.
   * @param userId The ID of the user to ban/unban.
   * @param bannedUntil The calculated expiration date (ISO string) or null to unban.
   */
  banUser(userId: number, bannedUntil: Date | null): Observable<void> {
    const endpoint = `${this.baseUrl}${API_ENDPOINTS.ADMIN.BAN_USER}`;

    // Format the date to an ISO string, or use null for the payload
    const untilString = bannedUntil ? bannedUntil.toISOString() : null;

    const payload: BanRequestPayload = { id: userId, until: untilString };

    return this.http.patch<void>(endpoint, payload);
  }

  // We keep this as a convenience method for the component logic
  unbanUser(userId: number): Observable<void> {
    return this.banUser(userId, null);
  }

  deleteUser(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.DELETE_USER}/${userId}`);
  }

  /**
   * Promotes a user to ADMIN role.
   */
  promoteUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.PROMOTE_USER}/${userId}`, {});
  }
  /**
   * Demotes a user to USER role.
   */

  demoteUser(userId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.DEMOTE_USER}/${userId}`, {});
  }

  // Posts Management
  getAllPosts(cursor: number = 0, search?: string): Observable<AdminPost[]> {
    let params = new HttpParams().set('cursor', cursor.toString());

    if (search) {
      params = params.set('search', search);
    }

    return this.http.get<AdminPost[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.POSTS}`, { params });
  }

  getPostById(postId: number): Observable<AdminPost> {
    return this.http.get<AdminPost>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.GET_POST}/${postId}`);
  }

  hidePost(postId: number): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.HIDE_POST}/${postId}`, {});
  }

  unhidePost(postId: number): Observable<void> {
    return this.hidePost(postId);
  }

  deletePost(postId: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.DELETE_POST}/${postId}`);
  }

  // Reports Management
  getAllReports(cursor: number = 0, status?: string): Observable<Report[]> {
    let params = new HttpParams().set('cursor', cursor.toString());

    if (status) {
      params = params.set('status', status);
    }

    return this.http.get<Report[]>(`${this.baseUrl}${API_ENDPOINTS.ADMIN.REPORTS}`, { params });
  }

  resolveReport(reportId: number): Observable<void> {
    return this.http.patch<void>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.RESOLVE_REPORT}/${reportId}`,
      {}
    );
  }

  dismissReport(reportId: number): Observable<void> {
    return this.http.patch<void>(
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
