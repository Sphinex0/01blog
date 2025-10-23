export interface AdminStats {
  totalUsers: number;
  totalPosts: number;
  totalReports: number;
  bannedUsersCount: number;
  activeUsers: number;
  postsThisMonth: number;
  reportsThisMonth: number;
  pendingReports: number;
  resolvedReports: number;
  dismissedReports: number;
  // NEW FIELD
  mostReportedUsers: UserReportSummary[];
  totalBannedUsers: number;
}

export interface UserReportSummary {
  userId: number;
  username: string;
  fullName: string;
  avatar?: string;
  reportCount: number;
  lastReportedAt: Date;
}

export interface AnalyticsData {
  stats: AdminStats;
  mostReportedUsers: UserReportSummary[];
  recentActivity: {
    date: string;
    newUsers: number;
    newPosts: number;
    newReports: number;
  }[];
}
