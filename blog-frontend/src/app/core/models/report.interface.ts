export interface Report {
  id: number;
  reportedUserId: number;
  reported: {
    id: number;
    username: string;
    fullName: string;
    avatar?: string;
  };
  reporterId: number;
  reporter: {
    id: number;
    username: string;
    fullName: string;
  };
  reason: string;
  status: 'PENDING' | 'RESOLVED' | 'DISMISSED'; // CHANGE to uppercase
  createdAt: Date;
  resolvedAt?: Date;
  resolvedBy?: string; // ADD THIS
  postId?: number | null; // <-- NEW: Optional ID if a post was reported
}

export interface CreateReportRequest {
  reportedUserId: number;
  reason: string;
}