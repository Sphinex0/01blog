export interface Report {
  id: number;
  reportedUserId: number;
  reportedUser: User;
  reporterId: number;
  reporter: User;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: Date;
  resolvedAt?: Date;
}

export interface CreateReportRequest {
  reportedUserId: number;
  reason: string;
}

import { User } from './user.interface';
