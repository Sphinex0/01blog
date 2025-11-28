import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
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
      `${this.baseUrl}${API_ENDPOINTS.SUBSCRIPTIONS.FOLLOW}/${userId}`,
      {responseType: 'text'}
    );
  }

  /**
   * Unfollow a user
   */
  unfollowUser(userId: number): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}${API_ENDPOINTS.SUBSCRIPTIONS.UNFOLLOW}/${userId}`
    );
  }


}