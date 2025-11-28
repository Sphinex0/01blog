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
  isHidden?: boolean; 
  createdAt: Date;
  updatedAt: Date;
}


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