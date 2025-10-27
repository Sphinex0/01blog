import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UpdateUserRequest } from '../../../core/models/user.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  // private readonly __currentCursor = signal<number>(0);


  /**
   * Get user profile by username
   */
  getUserByUsername(username: string): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.BY_USERNAME}/${username}`
    );
  }

  /**
   * Update current user profile
   */

  updateAvatar(file: File) {
        const formData = new FormData();
        formData.append('file', file)
        return this.http.patch<{ url: string }>(`${this.baseUrl}${API_ENDPOINTS.MEDIA.LOCAL_UPLOAD}`, formData)
    }
  // updateAvatar(data: UpdateUserRequest): Observable<ApiResponse<UserProfile>> {
  //   return this.http.put<ApiResponse<UserProfile>>(
  //     `${this.baseUrl}${API_ENDPOINTS.USERS.UPDATE_PROFILE}`,
  //     data
  //   );
  // }

  /**
   * Get all users (for discover page)
   */
  getAllUsers(cursor: number): Observable<UserProfile[]> {
    const params = new HttpParams().set('cursor', cursor);

    return this.http.get<UserProfile[]>(`${this.baseUrl}/users`, { params });
  }

/**
   * Search users by name or username with pagination
   */
  searchUsers(query: string, cursor: number = 0, size: number = 10): Observable<UserProfile[]> {
    const params = new HttpParams()
      .set('q', query)
      .set('cursor', cursor.toString())
      // .set('size', size.toString());

    return this.http.get<UserProfile[]>(`${this.baseUrl}${API_ENDPOINTS.USERS.SEARCH}`, { params });
  }

  /**
   * Get user's followers
   */
  getFollowers(userId: number, cursor: number): Observable<UserProfile[]> {
    const params = new HttpParams().set('cursor', cursor);

    return this.http.get<UserProfile[]>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.FOLLOWERS}/${userId}`,
      { params }
    );
  }

  /**
   * Get user's following
   */
  getFollowing(userId: number, cursor: number): Observable<UserProfile[]> {
    const params = new HttpParams().set('cursor', cursor);

    return this.http.get<UserProfile[]>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.FOLLOWING}/${userId}`,
      { params }
    );
  }
}
