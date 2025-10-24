import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { take } from 'rxjs'; 
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

// Your project imports
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


// --- Ban Duration Dialog Component ---
@Component({
  selector: 'app-ban-duration-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>BAN USER</h2>
    <mat-dialog-content>
      <p>Enter the duration (in days) for the ban. Leave blank or enter 0 for a **Permanent Ban**.</p>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Ban Duration (Days)</mat-label>
        <input matInput type="number" [(ngModel)]="durationDays" min="0">
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">CANCEL</button>
      <button mat-raised-button color="warn" (click)="confirmBan()">CONFIRM BAN</button>
    </mat-dialog-actions>
  `,
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
})
export class BanDurationDialog {
   readonly dialogRef = inject(MatDialogRef<BanDurationDialog>);
  durationDays: number | undefined = 7;
  
  confirmBan(): void {
    // If duration is 0 or less, treat as permanent (represented by null date)
    if (this.durationDays === undefined || this.durationDays <= 0) {
      this.dialogRef.close({ bannedUntil: null, isPermanent: true });
      return;
    }

    // Calculate the future date
    const bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + this.durationDays);
    
    this.dialogRef.close({ bannedUntil: bannedUntil, isPermanent: false });
  }

  // Helper to allow closing
  close() {
    this.dialogRef.close();
  }
}
// ------------------------------------


@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    TimeAgoPipe,
    MatInputModule,
    FormsModule,
    // BanDurationDialog not directly imported here, only referenced via MatDialog
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

  // Users (Infinite Scroll)
  readonly users = signal<AdminUserDetails[]>([]);
  readonly isLoadingUsers = signal(false);
  readonly usersTotal = signal(0);
  readonly usersCursor = signal(0); // ID of the last item fetched
  readonly hasMoreUsers = signal(true);
  readonly usersPageSize = signal(10); // Chunk size

  // Posts (Infinite Scroll)
  readonly posts = signal<AdminPost[]>([]);
  readonly isLoadingPosts = signal(false);
  readonly postsTotal = signal(0);
  readonly postsCursor = signal(0); // ID of the last item fetched
  readonly hasMorePosts = signal(true);
  readonly postsPageSize = signal(12); // Chunk size

  // Reports (Infinite Scroll)
  readonly reports = signal<Report[]>([]);
  readonly isLoadingReports = signal(false);
  readonly reportsTotal = signal(0);
  readonly reportsCursor = signal(0); // ID of the last item fetched
  readonly hasMoreReports = signal(true);
  readonly reportsPageSize = signal(10); // Chunk size
  readonly selectedReportStatus = signal<string>('PENDING');

  ngOnInit(): void {
    // this.loadStats();
    this.loadUsers(true); // Initial load
    // this.loadPosts(true);
    // this.loadReports(true);
  }

  // Load Stats
  loadStats(): void {
    this.isLoadingStats.set(true);
    this.analyticsService.getStats().pipe(take(1)).subscribe({
      next: (stats) => {
        this.stats.set(stats);
        this.isLoadingStats.set(false);
        // Update totals for dashboard tabs based on fresh stats
        this.usersTotal.set(stats.totalUsers);
        this.postsTotal.set(stats.totalPosts);
        this.reportsTotal.set(stats.totalReports);
      },
      error: () => {
        this.snackBar.open(ERROR_MESSAGES.SERVER_ERROR, 'Close', { duration: 3000 });
        this.isLoadingStats.set(false);
      }
    });
  }

  // --- USERS MANAGEMENT (Infinite Scroll - Array Response) ---
  loadUsers(isInitialLoad: boolean = false): void {
    if (this.isLoadingUsers() || (!this.hasMoreUsers() && !isInitialLoad)) {
      return;
    }
    this.isLoadingUsers.set(true);
    const currentCursor = isInitialLoad ? 0 : this.usersCursor();

    this.adminService.getAllUsers(currentCursor, this.usersPageSize()).pipe(take(1)).subscribe({
      next: (data: AdminUserDetails[]) => {
        
        if (currentCursor === 0) {
          this.users.set(data);
        } else {
          this.users.update((current) => [...current, ...data]);
        }
        
        // If the returned array size is less than the requested size, there are no more items.
        this.hasMoreUsers.set(data.length === this.usersPageSize());
        
        if (data.length > 0) {
          this.usersCursor.set(data[data.length - 1].id);
        }
        this.isLoadingUsers.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
        this.isLoadingUsers.set(false);
      }
    });
  }

  onUsersScrollBottom(): void {
    if (this.hasMoreUsers() && !this.isLoadingUsers()) {
      setTimeout(() => { // Using setTimeout to allow DOM reflow and prevent re-entrancy
        this.loadUsers();
      });
    }
  }

  onBanUser(user: AdminUserDetails): void {
    if (user.isBanned) {
      // UNBAN ACTION
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'UNBAN USER',
          message: `Are you sure you want to unban ${user.username}?`,
          confirmText: 'UNBAN',
          cancelText: 'Cancel',
          type: 'success'
        }
      }).afterClosed().pipe(take(1)).subscribe(result => {
        if (result) {
          // Call banUser with null date to unban
          this.adminService.banUser(user.id, null).pipe(take(1)).subscribe({
            next: () => {
              this.snackBar.open(SUCCESS_MESSAGES.USER_UNBANNED, 'Close', { duration: 2000 });
              user.isBanned = false; // Update locally to reflect change
              user.bannedUntil = null;
              // this.loadUsers(true);
              // this.loadStats();
            },
            error: () => {
              this.snackBar.open(`Failed to unban user`, 'Close', { duration: 3000 });
            }
          });
        }
      });
    } else {
      // BAN ACTION - Prompt for duration
      this.dialog.open(BanDurationDialog, {
        width: '400px',
      }).afterClosed().pipe(take(1)).subscribe(dialogResult => {
        if (dialogResult && (dialogResult.bannedUntil instanceof Date || dialogResult.isPermanent)) {
          //1000 year for perm
          let bannedUntilDate = dialogResult.bannedUntil;
          if (dialogResult.isPermanent) {
            bannedUntilDate = new Date();
            bannedUntilDate.setFullYear(bannedUntilDate.getFullYear() + 1000);
          }
          const durationDays = dialogResult.durationDays; // Used only for messaging

          this.adminService.banUser(user.id, bannedUntilDate).pipe(take(1)).subscribe({
            next: () => {
              const message = dialogResult.isPermanent
                ? `User ${user.username} permanently banned.` 
                : `User ${user.username} banned for ${durationDays} days.`;
                
              this.snackBar.open(message, 'Close', { duration: 2000 });
              user.isBanned = true; // Update locally to reflect change
              user.bannedUntil = bannedUntilDate;
              // this.loadUsers(true);
              // this.loadStats();
            },
            error: (err) => {
              this.snackBar.open(`Failed to ban user: ${err.error?.message || 'Server error'}`, 'Close', { duration: 3000 });
            }
          });
        }
      });
    }
  }

  onDeleteUser(user: AdminUserDetails): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete User',
        message: `Are you sure you want to permanently delete ${user.username}? This will delete all their posts and comments.`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.adminService.deleteUser(user.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open(SUCCESS_MESSAGES.USER_DELETED, 'Close', { duration: 2000 });
            // Reload from start
            this.usersCursor.set(0); 
            this.hasMoreUsers.set(true);
            this.users.update((current) => current.filter((u)=>u!=user)); // Clear current list
            // this.loadUsers(true);
            // this.loadStats();
          },
          error: () => {
            this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  // --- POSTS MANAGEMENT (Infinite Scroll - Array Response) ---
  loadPosts(isInitialLoad: boolean = false): void {
    if (this.isLoadingPosts() || (!this.hasMorePosts() && !isInitialLoad)) {
      return;
    }
    this.isLoadingPosts.set(true);
    const currentCursor = isInitialLoad ? 0 : this.postsCursor();

    this.adminService.getAllPosts(currentCursor, this.postsPageSize()).pipe(take(1)).subscribe({
      next: (data: AdminPost[]) => {
        
        if (currentCursor === 0) {
          this.posts.set(data);
          this.postsTotal.set(this.stats()?.totalPosts || data.length);
        } else {
          this.posts.update((current) => [...current, ...data]);
        }

        // If the returned array size is less than the requested size, there are no more items.
        this.hasMorePosts.set(data.length === this.postsPageSize());

        if (data.length > 0) {
          this.postsCursor.set(data[data.length - 1].id);
        }
        this.isLoadingPosts.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
        this.isLoadingPosts.set(false);
      }
    });
  }

  onPostsScrollBottom(): void {
    if (this.hasMorePosts() && !this.isLoadingPosts()) {
      setTimeout(() => {
        this.loadPosts();
      });
    }
  }

  onTogglePostVisibility(post: AdminPost): void {
    const action = post.isHidden ? 'unhide' : 'hide';
    const request = post.isHidden 
      ? this.adminService.unhidePost(post.id)
      : this.adminService.hidePost(post.id);

    request.pipe(take(1)).subscribe({
      next: () => {
        const message = post.isHidden ? SUCCESS_MESSAGES.POST_UNHIDDEN : SUCCESS_MESSAGES.POST_HIDDEN;
        this.snackBar.open(message, 'Close', { duration: 2000 });
        // Update post status locally to avoid full reload
        this.posts.update(posts => posts.map(p => p.id === post.id ? {...p, isHidden: !post.isHidden} : p));
      },
      error: () => {
        this.snackBar.open(`Failed to ${action} post`, 'Close', { duration: 3000 });
      }
    });
  }

  onDeletePost(post: AdminPost): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Post',
        message: `Are you sure you want to permanently delete "${post.title}"?`,
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.adminService.deletePost(post.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open(SUCCESS_MESSAGES.POST_DELETED, 'Close', { duration: 2000 });
            // Reload from start
            this.postsCursor.set(0); 
            this.hasMorePosts.set(true);
            this.loadPosts(true);
            this.loadStats();
          },
          error: () => {
            this.snackBar.open('Failed to delete post', 'Close', { duration: 3000 });
          }
        });
      }
    });
  }

  // --- REPORTS MANAGEMENT (Infinite Scroll - Array Response) ---
  loadReports(isInitialLoad: boolean = false): void {
    if (this.isLoadingReports() || (!this.hasMoreReports() && !isInitialLoad)) {
      return;
    }
    this.isLoadingReports.set(true);
    const currentCursor = isInitialLoad ? 0 : this.reportsCursor();

    this.adminService.getAllReports(
      currentCursor, 
      this.reportsPageSize(),
      this.selectedReportStatus()
    ).pipe(take(1)).subscribe({
      next: (data: Report[]) => {
        
        if (currentCursor === 0) {
          this.reports.set(data);
          this.reportsTotal.set(this.stats()?.totalReports || data.length);
        } else {
          this.reports.update((current) => [...current, ...data]);
        }

        // If the returned array size is less than the requested size, there are no more items.
        this.hasMoreReports.set(data.length === this.reportsPageSize());

        if (data.length > 0) {
          this.reportsCursor.set(data[data.length - 1].id);
        }
        this.isLoadingReports.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 });
        this.isLoadingReports.set(false);
      }
    });
  }

  onReportsScrollBottom(): void {
    if (this.hasMoreReports() && !this.isLoadingReports()) {
      setTimeout(() => {
        this.loadReports();
      });
    }
  }

  onReportStatusChange(status: string): void {
    this.selectedReportStatus.set(status);
    this.reportsCursor.set(0); // Reset cursor
    this.hasMoreReports.set(true); // Reset load state
    this.reports.set([]); // Clear current list
    this.loadReports(true); // Trigger new initial load
  }

  onResolveReport(report: Report): void {
    this.adminService.resolveReport(report.id).pipe(take(1)).subscribe({
      next: () => {
        this.snackBar.open(SUCCESS_MESSAGES.REPORT_RESOLVED, 'Close', { duration: 2000 });
        this.loadReports(true);
        this.loadStats();
      },
      error: () => {
        this.snackBar.open('Failed to resolve report', 'Close', { duration: 3000 });
      }
    });
  }

  onDismissReport(report: Report): void {
    this.adminService.dismissReport(report.id).pipe(take(1)).subscribe({
      next: () => {
        this.snackBar.open(SUCCESS_MESSAGES.REPORT_DISMISSED, 'Close', { duration: 2000 });
        this.loadReports(true);
      },
      error: () => {
        this.snackBar.open('Failed to dismiss report', 'Close', { duration: 3000 });
      }
    });
  }

  onDeleteReport(report: Report): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Report',
        message: 'Are you sure you want to delete this report?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        type: 'danger'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(result => {
      if (result) {
        this.adminService.deleteReport(report.id).pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open(SUCCESS_MESSAGES.REPORT_DELETED, 'Close', { duration: 2000 });
            this.loadReports(true);
          },
          error: () => {
            this.snackBar.open('Failed to delete report', 'Close', { duration: 3000 });
          }
        });
      }
    });
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