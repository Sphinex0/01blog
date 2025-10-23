import { UserProfile } from "./user.interface";

export interface Notification {
  id: number;
  sender: UserProfile;
  postId: number;
  read: boolean;
  createdAt: Date;
}
