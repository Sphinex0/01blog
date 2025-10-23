import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { AdminStats, AnalyticsData, UserReportSummary } from '../../../core/models/admin.interface';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.STATS}`
    );
  }

  getAnalytics(): Observable<AnalyticsData> {
    return this.http.get<AnalyticsData>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.ANALYTICS}`
    );
  }

  getMostReportedUsers(limit: number = 5): Observable<UserReportSummary[]> {
    return this.http.get<UserReportSummary[]>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.ANALYTICS}/most-reported`,
      { params: { limit: limit.toString() } }
    );
  }
}