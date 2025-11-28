import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RegisterRequest, LoginRequest, AuthResponse } from '../../../core/models/user.interface';
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

  logout(): Observable<void> {
    return this.http.post<void>(
      `${this.baseUrl}${API_ENDPOINTS.AUTH.LOGOUT}`,
      {}
    );
  }
}
