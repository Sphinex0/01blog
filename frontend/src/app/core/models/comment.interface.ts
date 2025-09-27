export interface Comment {
  id: number;
  content: string;
  author: User;
  postId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCommentRequest {
  content: string;
  postId: number;
}

import { User } from './user.interface';
