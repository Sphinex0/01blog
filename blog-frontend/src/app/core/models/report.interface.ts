import { User } from "./user.interface";

export interface Report {
  id: number;
  reportedUserId: number;
  reported: User;
  reporterId: number;
  reporter: {
    id: number;
    username: string;
    fullName: string;
  };
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'; 
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string; 
  postId?: number | null; 
  postHidden:boolean;
}

export interface CreateReportRequest {
  reportedUserId: number;
  reportedPostId?: number;
  reason: string;
}