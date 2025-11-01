import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, LoginRequest, AuthResponse, UserProfile } from '../../../core/models/user.interface';
import { ApiResponse } from '../../../core/models/api-response.interface';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';

@Injectable({
  providedIn: 'root'
})
export class AuthApiService {
  private readonly baseUrl = API_BASE_URL;

  constructor(private http: HttpClient) {}

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`,
      data
    );
  }

  login(data: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}`,
      data
    );
  }

  logout(): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {}
    );
  }

  refreshToken(refreshToken: string): Observable<ApiResponse<AuthResponse>> {
    return this.http.post<ApiResponse<AuthResponse>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.REFRESH}`,
      { refreshToken }
    );
  }

  forgotPassword(email: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`,
      { email }
    );
  }

  resetPassword(token: string, newPassword: string): Observable<ApiResponse<void>> {
    return this.http.post<ApiResponse<void>>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`,
      { token, newPassword }
    );
  }



}
