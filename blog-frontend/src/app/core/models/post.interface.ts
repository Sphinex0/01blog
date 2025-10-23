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
  isHidden?: boolean; // ADD THIS for admin
  createdAt: Date;
  updatedAt: Date;
}

// ADD THIS: For admin post management
export interface AdminPost extends Post {
  reportCount?: number;
}

export interface CreatePostRequest {
  title: string;
  content: string;
}

export interface UpdatePostRequest {
  title?: string;
  content?: string;
  media?: File;
}

import { User } from './user.interface';