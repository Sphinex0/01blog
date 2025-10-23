import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { PaginatedResponse } from '../../../core/models/api-response.interface';
import { AdminUserDetails } from '../../../core/models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  getUsers(page: number = 0, size: number = 10, filters?: {
    search?: string;
    role?: string;
    isBanned?: boolean;
  }): Observable<PaginatedResponse<AdminUserDetails>> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filters?.search) {
      params = params.set('search', filters.search);
    }
    if (filters?.role) {
      params = params.set('role', filters.role);
    }
    if (filters?.isBanned !== undefined) {
      params = params.set('isBanned', filters.isBanned.toString());
    }

    return this.http.get<PaginatedResponse<AdminUserDetails>>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.USERS}`,
      { params }
    );
  }

  getUserDetails(userId: number): Observable<AdminUserDetails> {
    return this.http.get<AdminUserDetails>(
      `${this.baseUrl}${API_ENDPOINTS.ADMIN.GET_USER}/${userId}`
    );
  }

  searchUsers(query: string, page: number = 0, size: number = 10): Observable<PaginatedResponse<AdminUserDetails>> {
    return this.getUsers(page, size, { search: query });
  }

  getBannedUsers(page: number = 0, size: number = 10): Observable<PaginatedResponse<AdminUserDetails>> {
    return this.getUsers(page, size, { isBanned: true });
  }

  getAdminUsers(page: number = 0, size: number = 10): Observable<PaginatedResponse<AdminUserDetails>> {
    return this.getUsers(page, size, { role: 'ADMIN' });
  }
}