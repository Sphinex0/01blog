import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  /**
   * Follow a user
   */
  TogglefollowUser(userId: number): Observable<{ action: string }> {
    console.log('Following user with ID:', userId);
    return this.http.post<{ action: string }>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.FOLLOW}/${userId}`,
      {responseType: 'text'}
    );
  }

  /**
   * Unfollow a user
   */
  unfollowUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.USERS.UNFOLLOW}/${userId}`
    );
  }

  /**
   * Check if current user is following a specific user
   */
  isFollowing(userId: number): Observable<ApiResponse<{ isFollowing: boolean }>> {
    return this.http.get<ApiResponse<{ isFollowing: boolean }>>(
      `${this.baseUrl}/users/${userId}/is-following`
    );
  }
}