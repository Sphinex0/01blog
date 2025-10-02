export interface Post {
  id: number;
  title: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  user: User;
  likesCount: number;
  commentsCount: number;
  isLiked?: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostRequest {
  // title: string;
  content: string;
  // media?: File;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  media?: File;
}

import { User } from './user.interface';
