import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Your project imports
// import { AdminService } from '../../services/admin';
// import { AnalyticsService } from '../../services/analytics';
import { AdminStats } from '../../../../core/models/admin.interface';
import { AdminUserDetails } from '../../../../core/models/user.interface';
import { AdminPost } from '../../../../core/models/post.interface';
import { Report } from '../../../../core/models/report.interface';
import { API_BASE_URL } from '../../../../core/constants/api.constants';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '../../../../core/constants/app.constants';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { AdminService } from '../../services/admin.service';
import { AnalyticsService } from '../../services/analytics.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TimeAgoPipe
  ],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss'
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  // Stats
  readonly stats = signal<AdminStats | null>(null);
  readonly isLoadingStats = signal(false);

  // Users
  readonly users = signal<AdminUserDetails[]>([]);
  readonly isLoadingUsers = signal(false);
  readonly usersTotal = signal(0);
  readonly usersPage = signal(0);
  readonly usersPageSize = signal(10);

  // Posts
  readonly posts = signal<AdminPost[]>([]);
  readonly isLoadingPosts = signal(false);
  readonly postsTotal = signal(0);
  readonly postsPage = signal(0);
  readonly postsPageSize = signal(12);

  // Reports
  readonly reports = signal<Report[]>([]);
  readonly isLoadingReports = signal(false);
  readonly reportsTotal = signal(0);
  readonly reportsPage = signal(0);
  readonly reportsPageSize = signal(10);
  readonly selectedReportStatus = signal<string>('PENDING');

  ngOnInit(): void {
    this.loadStats();
    this.loadUsers();
    this.loadPosts();
    this.loadReports();
  }

  // Load Stats
  loadStats(): void {
    // this.isLoadingStats.set(true);
    // this.analyticsService.getStats().subscribe({
    //   next: (stats) => {
    //     this.stats.set(stats);
    //     this.isLoadingStats.set(false);
    //   },
    //   error: () => {
    //     this.snackBar.open(ERROR_MESSAGES.SERVER_ERROR, 'Close', { duration: 3000 });
    //     this.isLoadingStats.set(false);
    //   }
    // });
  }

  // Users Management
  loadUsers(): void {
    this.isLoadingUsers.set(true);
    this.adminService.getAllUsers(this.usersPage(), this.usersPageSize()).subscribe({
      next: (response) => {
        this.users.set(response);
        this.usersTotal.set(response.length);
        this.isLoadingUsers.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.isLoadingUsers.set(false);
      }
    });
  }

  onUsersPageChange(event: PageEvent): void {
    this.usersPage.set(event.pageIndex);
    this.usersPageSize.set(event.pageSize);
    this.loadUsers();
  }

  onBanUser(user: AdminUserDetails): void {
    // const action = user.isBanned ? 'unban' : 'ban';
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: `${action.toUpperCase()} User`,
    //     message: `Are you sure you want to ${action} ${user.username}?`,
    //     confirmText: action.toUpperCase(),
    //     cancelText: 'Cancel'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     const request = user.isBanned 
    //       ? this.adminService.unbanUser(user.id)
    //       : this.adminService.banUser(user.id);

    //     request.subscribe({
    //       next: () => {
    //         const message = user.isBanned ? SUCCESS_MESSAGES.USER_UNBANNED : SUCCESS_MESSAGES.USER_BANNED;
    //         this.snackBar.open(message, 'Close', { duration: 2000 });
    //         this.loadUsers();
    //         this.loadStats();
    //       },
    //       error: () => {
    //         this.snackBar.open(`Failed to ${action} user`, 'Close', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
  }

  onDeleteUser(user: AdminUserDetails): void {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Delete User',
    //     message: `Are you sure you want to permanently delete ${user.username}? This will delete all their posts and comments.`,
    //     confirmText: 'Delete',
    //     cancelText: 'Cancel'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.adminService.deleteUser(user.id).subscribe({
    //       next: () => {
    //         this.snackBar.open(SUCCESS_MESSAGES.USER_DELETED, 'Close', { duration: 2000 });
    //         this.loadUsers();
    //         this.loadStats();
    //       },
    //       error: () => {
    //         this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
  }

  // Posts Management
  loadPosts(): void {
    // this.isLoadingPosts.set(true);
    // this.adminService.getAllPosts(this.postsPage(), this.postsPageSize()).subscribe({
    //   next: (response) => {
    //     this.posts.set(response.data);
    //     this.postsTotal.set(response.total);
    //     this.isLoadingPosts.set(false);
    //   },
    //   error: () => {
    //     this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
    //     this.isLoadingPosts.set(false);
    //   }
    // });
  }

  onPostsPageChange(event: PageEvent): void {
    this.postsPage.set(event.pageIndex);
    this.postsPageSize.set(event.pageSize);
    this.loadPosts();
  }

  onTogglePostVisibility(post: AdminPost): void {
    // const action = post.isHidden ? 'unhide' : 'hide';
    // const request = post.isHidden 
    //   ? this.adminService.unhidePost(post.id)
    //   : this.adminService.hidePost(post.id);

    // request.subscribe({
    //   next: () => {
    //     const message = post.isHidden ? SUCCESS_MESSAGES.POST_UNHIDDEN : SUCCESS_MESSAGES.POST_HIDDEN;
    //     this.snackBar.open(message, 'Close', { duration: 2000 });
    //     this.loadPosts();
    //   },
    //   error: () => {
    //     this.snackBar.open(`Failed to ${action} post`, 'Close', { duration: 3000 });
    //   }
    // });
  }

  onDeletePost(post: AdminPost): void {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Delete Post',
    //     message: `Are you sure you want to permanently delete "${post.title}"?`,
    //     confirmText: 'Delete',
    //     cancelText: 'Cancel'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.adminService.deletePost(post.id).subscribe({
    //       next: () => {
    //         this.snackBar.open(SUCCESS_MESSAGES.POST_DELETED, 'Close', { duration: 2000 });
    //         this.loadPosts();
    //         this.loadStats();
    //       },
    //       error: () => {
    //         this.snackBar.open('Failed to delete post', 'Close', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
  }

  // Reports Management
  loadReports(): void {
    // this.isLoadingReports.set(true);
    // this.adminService.getAllReports(
    //   this.reportsPage(), 
    //   this.reportsPageSize(),
    //   this.selectedReportStatus()
    // ).subscribe({
    //   next: (response) => {
    //     this.reports.set(response.data);
    //     this.reportsTotal.set(response.total);
    //     this.isLoadingReports.set(false);
    //   },
    //   error: () => {
    //     this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 });
    //     this.isLoadingReports.set(false);
    //   }
    // });
  }

  onReportsPageChange(event: PageEvent): void {
    this.reportsPage.set(event.pageIndex);
    this.reportsPageSize.set(event.pageSize);
    this.loadReports();
  }

  onReportStatusChange(status: string): void {
    this.selectedReportStatus.set(status);
    this.reportsPage.set(0);
    this.loadReports();
  }

  onResolveReport(report: Report): void {
    // this.adminService.resolveReport(report.id).subscribe({
    //   next: () => {
    //     this.snackBar.open(SUCCESS_MESSAGES.REPORT_RESOLVED, 'Close', { duration: 2000 });
    //     this.loadReports();
    //     this.loadStats();
    //   },
    //   error: () => {
    //     this.snackBar.open('Failed to resolve report', 'Close', { duration: 3000 });
    //   }
    // });
  }

  onDismissReport(report: Report): void {
    // this.adminService.dismissReport(report.id).subscribe({
    //   next: () => {
    //     this.snackBar.open(SUCCESS_MESSAGES.REPORT_DISMISSED, 'Close', { duration: 2000 });
    //     this.loadReports();
    //   },
    //   error: () => {
    //     this.snackBar.open('Failed to dismiss report', 'Close', { duration: 3000 });
    //   }
    // });
  }

  onDeleteReport(report: Report): void {
    // const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
    //   width: '400px',
    //   data: {
    //     title: 'Delete Report',
    //     message: 'Are you sure you want to delete this report?',
    //     confirmText: 'Delete',
    //     cancelText: 'Cancel'
    //   }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.adminService.deleteReport(report.id).subscribe({
    //       next: () => {
    //         this.snackBar.open(SUCCESS_MESSAGES.REPORT_DELETED, 'Close', { duration: 2000 });
    //         this.loadReports();
    //       },
    //       error: () => {
    //         this.snackBar.open('Failed to delete report', 'Close', { duration: 3000 });
    //       }
    //     });
    //   }
    // });
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${API_BASE_URL}/${url}`;
  }

  getInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }
}