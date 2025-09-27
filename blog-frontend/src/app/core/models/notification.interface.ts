export interface Notification {
  id: number;
  type: 'like' | 'comment' | 'follow' | 'new_post';
  message: string;
  userId: number;
  relatedUserId?: number;
  relatedPostId?: number;
  isRead: boolean;
  createdAt: Date;
}
