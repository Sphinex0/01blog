import { UserProfile } from "./user.interface";

export interface Notification {
  id: number;
  // type: 'like' | 'comment' | 'follow' | 'new_post' ;
  // message: string;
  // userId: number;
  sender: UserProfile;
  // relatedUserId?: number;
  postId: number;
  read: boolean;
  createdAt: Date;
}
