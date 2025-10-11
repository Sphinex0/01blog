import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserProfile, UpdateUserRequest } from '../../../core/models/user.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  /**
   * Get current user profile
   */
  getCurrentUserProfile(): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.PROFILE}`
    );
  }

  /**
   * Get user profile by username
   */
  getUserByUsername(username: string): Observable<ApiResponse<UserProfile>> {
    return this.http.get<ApiResponse<UserProfile>>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.BY_USERNAME}/${username}`
    );
  }

  /**
   * Update current user profile
   */
  updateProfile(data: UpdateUserRequest): Observable<ApiResponse<UserProfile>> {
    return this.http.put<ApiResponse<UserProfile>>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.UPDATE_PROFILE}`,
      data
    );
  }

  /**
   * Get all users (for discover page)
   */
  getAllUsers(): Observable<UserProfile[]> {
    return this.http.get<UserProfile[]>(
      `${this.baseUrl}/users`
    );
  }

  /**
   * Search users by name or username
   */
  searchUsers(query: string): Observable<ApiResponse<UserProfile[]>> {
    const params = new HttpParams().set('q', query);
    
    return this.http.get<ApiResponse<UserProfile[]>>(
      `${this.baseUrl}/users/search`,
      { params }
    );
  }

  /**
   * Get user's followers
   */
  getFollowers(userId: number): Observable<ApiResponse<UserProfile[]>> {
    return this.http.get<ApiResponse<UserProfile[]>>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.FOLLOWERS}/${userId}`
    );
  }

  /**
   * Get user's following
   */
  getFollowing(userId: number): Observable<ApiResponse<UserProfile[]>> {
    return this.http.get<ApiResponse<UserProfile[]>>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.FOLLOWING}/${userId}`
    );
  }
}