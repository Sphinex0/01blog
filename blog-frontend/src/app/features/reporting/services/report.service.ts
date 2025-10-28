import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { Report, CreateReportRequest } from '../../../core/models/report.interface';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = API_BASE_URL;

  createReport(request: CreateReportRequest): Observable<Report> {
    return this.http.post<Report>(
      `${this.baseUrl}${API_ENDPOINTS.REPORTS.CREATE}`,
      request
    );
  }
}