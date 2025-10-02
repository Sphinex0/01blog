import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { API_BASE_URL, API_ENDPOINTS } from '../../../core/constants/api.constants';
import { Observable, tap } from 'rxjs';
import { CreatePostRequest, Post } from '../../../core/models/post.interface';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private readonly baseUrl = API_BASE_URL;
  private readonly http = inject(HttpClient);

  savePost(data: CreatePostRequest) {
    this.http.post<Post>(`${this.baseUrl}${API_ENDPOINTS.POSTS.CREATE}`, data).subscribe();
  }
}
