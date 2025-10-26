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
import { MatDividerModule } from '@angular/material/divider';

// --- Ban Duration Dialog Component ---
// NOTE: Must be a standalone component or imported module if external.
@Component({
  selector: 'app-ban-duration-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title class="pixel-dialog-title">BAN USER</h2>
    <mat-dialog-content>
      <p>
        Enter the duration (in days) for the ban. Leave blank or enter 0 for a **Permanent Ban**.
      </p>
      <mat-form-field appearance="outline" style="width: 100%;">
        <mat-label>Ban Duration (Days)</mat-label>
        <input
          matInput
          type="number"
          [(ngModel)]="durationDays"
          min="0"
          placeholder="e.g., 7 for one week"
        />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close()">CANCEL</button>
      <button mat-raised-button color="warn" (click)="confirmBan()">CONFIRM BAN</button>
    </mat-dialog-actions>
  `,
  styles: [
    `
      .pixel-dialog-title {
        font-family: 'Press Start 2P', cursive;
        font-size: 14px;
      }
      mat-dialog-content p {
        font-family: 'Press Start 2P', cursive;
        font-size: 8px;
        margin-bottom: 1rem;
      }
      mat-dialog-actions button {
        font-family: 'Press Start 2P', cursive;
        font-size: 9px;
      }
    `,
  ],
  imports: [MatDialogModule, MatButtonModule, MatInputModule, MatFormFieldModule, FormsModule],
})
export class BanDurationDialog {
  readonly dialogRef = inject(MatDialogRef<BanDurationDialog>);
  durationDays: number | undefined = 7;

  confirmBan(): void {
    // If duration is 0 or undefined, treat as permanent (represented by null in API, but date logic is safer)
    if (this.durationDays === undefined || this.durationDays <= 0) {
      // Use a distant future date (e.g., 100 years) to represent "Permanent"
      const permanentDate = new Date(new Date().setFullYear(new Date().getFullYear() + 100));
      this.dialogRef.close({ bannedUntil: permanentDate, isPermanent: true });
      return;
    }

    // Calculate the future date based on durationDays
    const bannedUntil = new Date();
    bannedUntil.setDate(bannedUntil.getDate() + this.durationDays);

    this.dialogRef.close({
      bannedUntil: bannedUntil,
      isPermanent: false,
      durationDays: this.durationDays,
    });
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
    MatDividerModule
],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboardComponent implements OnInit {
  private readonly adminService = inject(AdminService);
  private readonly analyticsService = inject(AnalyticsService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar); // Stats

  readonly stats = signal<AdminStats | null>(null);
  readonly isLoadingStats = signal(false); // Users (Infinite Scroll)

  readonly users = signal<AdminUserDetails[]>([]);
  readonly isLoadingUsers = signal(false);
  readonly usersTotal = signal(0);
  readonly usersCursor = signal(0); // ID of the last item fetched
  readonly hasMoreUsers = signal(true);
  readonly usersPageSize = signal(10); // Chunk size // Posts (Infinite Scroll)

  readonly posts = signal<AdminPost[]>([]);
  readonly isLoadingPosts = signal(false);
  readonly postsTotal = signal(0);
  readonly postsCursor = signal(0); // ID of the last item fetched
  readonly hasMorePosts = signal(true);
  readonly postsPageSize = signal(10); // Chunk size // Reports (Infinite Scroll)

  readonly reports = signal<Report[]>([]);
  readonly isLoadingReports = signal(false);
  readonly reportsTotal = signal(0);
  readonly reportsCursor = signal(0); // ID of the last item fetched
  readonly hasMoreReports = signal(true);
  readonly reportsPageSize = signal(10); // Chunk size
  readonly selectedReportStatus = signal<string>('PENDING');

  ngOnInit(): void {
    // this.loadStats();
    // Initialize with dummy stats for design preview
    // const dummyStats = {
    //   totalUsers: 123,
    //   totalPosts: 45,
    //   totalReports: 3,
    // } as unknown as AdminStats;

    // this.stats.set(dummyStats);
    // this.usersTotal.set(dummyStats.totalUsers);
    // this.postsTotal.set(dummyStats.totalPosts);
    // this.reportsTotal.set(dummyStats.totalReports);
    this.loadUsers(true); // Initial load
    this.loadPosts(true);
    this.loadReports(true);
  } // Helper function to get ban status info

  getBanStatus(user: AdminUserDetails): string {
    if (!user.isBanned) return '';

    if (user.bannedUntil) {
      const untilDate = new Date(user.bannedUntil);
      const now = new Date();

      // Check for permanent ban (distantly future date, like 100 years from TimeAgoPipe)
      if (TimeAgoPipe.timeUntil(user.bannedUntil) === 'PERMANENT') {
        return 'PERMANENT';
      }
      // Check if ban is expired
      if (untilDate.getTime() <= now.getTime()) {
        return 'EXPIRED';
      }
      // Show time left
      return TimeAgoPipe.timeUntil(user.bannedUntil);
    }
    // Fallback for systems only using isBanned=true
    return 'ACTIVE';
  } // Load Stats

  loadStats(): void {
    this.isLoadingStats.set(true);
    this.analyticsService
      .getStats()
      .pipe(take(1))
      .subscribe({
        next: (stats) => {
          this.stats.set(stats);
          this.isLoadingStats.set(false);
          this.usersTotal.set(stats.totalUsers);
          this.postsTotal.set(stats.totalPosts);
          this.reportsTotal.set(stats.totalReports);
        },
        error: () => {
          this.snackBar.open(ERROR_MESSAGES.SERVER_ERROR, 'Close', { duration: 3000 });
          this.isLoadingStats.set(false);
        },
      });
  } // --- USERS MANAGEMENT (Optimized State Update) ---

  loadUsers(isInitialLoad: boolean = false): void {
    if (this.isLoadingUsers() || (!this.hasMoreUsers() && !isInitialLoad)) {
      return;
    }
    this.isLoadingUsers.set(true);
    const currentCursor = isInitialLoad ? 0 : this.usersCursor();

    this.adminService
      .getAllUsers(currentCursor, this.usersPageSize())
      .pipe(take(1))
      .subscribe({
        next: (data: AdminUserDetails[]) => {
          if (currentCursor === 0) {
            this.users.set(data);
          } else {
            this.users.update((current) => [...current, ...data]);
          }
          this.hasMoreUsers.set(data.length === this.usersPageSize());
          if (data.length > 0) {
            this.usersCursor.set(data[data.length - 1].id);
          }
          this.isLoadingUsers.set(false);
        },
        error: () => {
          this.snackBar.open('Failed to load users', 'Close', { duration: 3000 });
          this.isLoadingUsers.set(false);
        },
      });
  }

  onUsersScrollBottom(): void {
    if (this.hasMoreUsers() && !this.isLoadingUsers()) {
      setTimeout(() => {
        // Using setTimeout to allow DOM reflow and prevent re-entrancy
        this.loadUsers();
      });
    }
  }

  onBanUser(user: AdminUserDetails | Report['reported']): void {
    // Attempt to find the full user object if only the subset from Report is passed
    let fullUser = this.users().find(u => u.id === user.id) as AdminUserDetails || user as AdminUserDetails;
    
    // Check if the user is currently banned (or is being treated as banned for the action)
    const isCurrentlyBanned = fullUser.isBanned;

    if (isCurrentlyBanned) {
      // UNBAN ACTION
      this.dialog.open(ConfirmationDialogComponent, {
        width: '400px',
        data: {
          title: 'UNBAN USER',
          message: `Are you sure you want to unban ${fullUser.username}?`,
          confirmText: 'UNBAN',
          cancelText: 'Cancel',
          type: 'success'
        }
      }).afterClosed().pipe(take(1)).subscribe(result => {
        if (result) {
          // Call banUser with null date to unban
          this.adminService.banUser(fullUser.id, null).pipe(take(1)).subscribe({
            next: () => {
              this.snackBar.open(SUCCESS_MESSAGES.USER_UNBANNED, 'Close', { duration: 2000 });
              // Update local state directly: set isBanned=false and clear bannedUntil
              this.users.update(users => users.map(u => 
                u.id === fullUser.id ? { ...u, isBanned: false, bannedUntil: null } : u
              ));
              this.reports.update((current) =>
                current.map((r) =>
                  r.reported && r.reported.id === fullUser.id
                    ? { ...r, reported: { ...r.reported, isBanned: false, bannedUntil: null } }
                    : r
                )
              );

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
          
          const bannedUntilDate: Date | null = dialogResult.isPermanent ? null : dialogResult.bannedUntil;
          const isPermanent = dialogResult.isPermanent;
          const durationDays = dialogResult.durationDays;

          this.adminService.banUser(fullUser.id, bannedUntilDate).pipe(take(1)).subscribe({
            next: () => {
              const message = isPermanent 
                ? `User ${fullUser.username} permanently banned.` 
                : `User ${fullUser.username} banned for ${durationDays} days.`;
                
              this.snackBar.open(message, 'Close', { duration: 2000 });
              // Update local state directly: set isBanned=true and bannedUntil date
              this.users.update(users => users.map(u => 
                u.id === fullUser.id ? { ...u, isBanned: true, bannedUntil: bannedUntilDate } : u
              ));
              this.reports.update((current) =>
                current.map((r) =>
                  r.reported && r.reported.id === fullUser.id
                    ? { ...r, reported: { ...r.reported, isBanned: true, bannedUntil: bannedUntilDate } }
                    : r
                )
              );
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
        title: 'DELETE USER',
        message: `Are you sure you want to permanently delete ${user.username}? This will delete all their posts and comments.`,
        confirmText: 'DELETE',
        cancelText: 'CANCEL',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.adminService
            .deleteUser(user.id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.snackBar.open(SUCCESS_MESSAGES.USER_DELETED, 'Close', { duration: 2000 }); // Update local state directly: remove the deleted user
                this.users.update((current) => current.filter((u) => u.id !== user.id));
                this.usersTotal.update((count) => Math.max(0, count - 1));
                // this.loadStats();
              },
              error: () => {
                this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
              },
            });
        }
      });
  } // --- ROLE MANAGEMENT ---

  onPromoteUser(user: AdminUserDetails): void {
    this.adminService
      .promoteUser(user.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackBar.open(SUCCESS_MESSAGES.USER_PROMOTED, 'Close', { duration: 2000 });
          // Update local state directly
          this.users.update((users) =>
            users.map((u) => (u.id === user.id ? { ...u, role: 'ADMIN' } : u))
          );
        },
        error: () => {
          this.snackBar.open('Failed to promote user', 'Close', { duration: 3000 });
        },
      });
  }

  onDemoteUser(user: AdminUserDetails): void {
    this.adminService
      .demoteUser(user.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackBar.open(SUCCESS_MESSAGES.USER_DEMOTED, 'Close', { duration: 2000 });
          // Update local state directly
          this.users.update((users) =>
            users.map((u) => (u.id === user.id ? { ...u, role: 'USER' } : u))
          );
        },
        error: () => {
          this.snackBar.open('Failed to demote user', 'Close', { duration: 3000 });
        },
      });
  } // --- POSTS MANAGEMENT (Optimized State Update) ---

  loadPosts(isInitialLoad: boolean = false): void {
    if (this.isLoadingPosts() || (!this.hasMorePosts() && !isInitialLoad)) {
      return;
    }
    this.isLoadingPosts.set(true);
    const currentCursor = isInitialLoad ? 0 : this.postsCursor();

    this.adminService
      .getAllPosts(currentCursor, this.postsPageSize())
      .pipe(take(1))
      .subscribe({
        next: (data: AdminPost[]) => {
          if (currentCursor === 0) {
            this.posts.set(data);
            this.postsTotal.set(this.stats()?.totalPosts || data.length);
          } else {
            this.posts.update((current) => [...current, ...data]);
          }

          this.hasMorePosts.set(data.length === this.postsPageSize());

          if (data.length > 0) {
            this.postsCursor.set(data[data.length - 1].id);
          }
          this.isLoadingPosts.set(false);
        },
        error: () => {
          this.snackBar.open('Failed to load posts', 'Close', { duration: 3000 });
          this.isLoadingPosts.set(false);
        },
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
    const isCurrentlyHidden = post.isHidden;
    const action = isCurrentlyHidden ? 'unhide' : 'hide';
    const request = isCurrentlyHidden
      ? this.adminService.unhidePost(post.id)
      : this.adminService.hidePost(post.id);

    request.pipe(take(1)).subscribe({
      next: () => {
        const message = isCurrentlyHidden
          ? SUCCESS_MESSAGES.POST_UNHIDDEN
          : SUCCESS_MESSAGES.POST_HIDDEN;
        this.snackBar.open(message, 'Close', { duration: 2000 }); // Update local state directly
        this.posts.update((posts) =>
          posts.map((p) => (p.id === post.id ? { ...p, isHidden: !isCurrentlyHidden } : p))
        );
      },
      error: () => {
        this.snackBar.open(`Failed to ${action} post`, 'Close', { duration: 3000 });
      },
    });
  }

  onDeletePost(post: AdminPost): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'DELETE POST',
        message: `Are you sure you want to permanently delete "${post.title}"?`,
        confirmText: 'DELETE',
        cancelText: 'CANCEL',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.adminService
            .deletePost(post.id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.snackBar.open(SUCCESS_MESSAGES.POST_DELETED, 'Close', { duration: 2000 }); // Update local state directly
                this.posts.update((current) => current.filter((p) => p.id !== post.id));
                this.postsTotal.update((count) => Math.max(0, count - 1));
                // this.loadStats();
              },
              error: () => {
                this.snackBar.open('Failed to delete post', 'Close', { duration: 3000 });
              },
            });
        }
      });
  } // --- REPORTS MANAGEMENT (Optimized State Update) ---

  loadReports(isInitialLoad: boolean = false): void {
    if (this.isLoadingReports() || (!this.hasMoreReports() && !isInitialLoad)) {
      return;
    }
    this.isLoadingReports.set(true);
    const currentCursor = isInitialLoad ? 0 : this.reportsCursor();

    this.adminService
      .getAllReports(currentCursor, this.reportsPageSize(), this.selectedReportStatus())
      .pipe(take(1))
      .subscribe({
        next: (data: Report[]) => {
          if (currentCursor === 0) {
            this.reports.set(data);
            this.reportsTotal.set(this.stats()?.totalReports || data.length);
          } else {
            this.reports.update((current) => [...current, ...data]);
          }

          this.hasMoreReports.set(data.length === this.reportsPageSize());

          if (data.length > 0) {
            this.reportsCursor.set(data[data.length - 1].id);
          }
          this.isLoadingReports.set(false);
        },
        error: () => {
          this.snackBar.open('Failed to load reports', 'Close', { duration: 3000 });
          this.isLoadingReports.set(false);
        },
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
    this.adminService
      .resolveReport(report.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackBar.open(SUCCESS_MESSAGES.REPORT_RESOLVED, 'Close', { duration: 2000 });
          // Update local state directly: set status to RESOLVED
          this.reports.update((reports) =>
            reports.map((r) => (r.id === report.id ? { ...r, status: 'RESOLVED' as const } : r))
          );
          // this.loadStats();
        },
        error: () => {
          this.snackBar.open('Failed to resolve report', 'Close', { duration: 3000 });
        },
      });
  }

  onDismissReport(report: Report): void {
    this.adminService
      .dismissReport(report.id)
      .pipe(take(1))
      .subscribe({
        next: () => {
          this.snackBar.open(SUCCESS_MESSAGES.REPORT_DISMISSED, 'Close', { duration: 2000 });
          // Update local state directly: set status to DISMISSED
          this.reports.update((reports) =>
            reports.map((r) => (r.id === report.id ? { ...r, status: 'DISMISSED' as const } : r))
          );
        },
        error: () => {
          this.snackBar.open('Failed to dismiss report', 'Close', { duration: 3000 });
        },
      });
  }

  onDeleteReport(report: Report): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'DELETE REPORT',
        message: 'Are you sure you want to delete this report?',
        confirmText: 'DELETE',
        cancelText: 'CANCEL',
        type: 'danger',
      },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((result) => {
        if (result) {
          this.adminService
            .deleteReport(report.id)
            .pipe(take(1))
            .subscribe({
              next: () => {
                this.snackBar.open(SUCCESS_MESSAGES.REPORT_DELETED, 'Close', { duration: 2000 });
                // Update local state directly: remove the report
                this.reports.update((current) => current.filter((r) => r.id !== report.id));
              },
              error: () => {
                this.snackBar.open('Failed to delete report', 'Close', { duration: 3000 });
              },
            });
        }
      });
  }

  // --- Quick Action Handlers for Reports Tab ---
  // Quick Ban from Report card
  onQuickBanUserFromReport(report: Report) {
    // We only have subset user data in the report, so we pass it to the main handler.
    this.onBanUser(report.reported);
  }


  // Quick Hide Post from Report card
  onQuickHidePostFromReport(report: Report) {
    if (!report.postId) {
      this.snackBar.open('Report is not linked to a post.', 'Close', { duration: 3000 });
      return;
    }
    
    // Find the post's current state (isHidden) if possible, otherwise assume not hidden for simplicity
    const isCurrentlyHidden = report.postHidden;

    const action = isCurrentlyHidden ? 'unhide' : 'hide';
    const request = isCurrentlyHidden
      ? this.adminService.unhidePost(report.postId!)
      : this.adminService.hidePost(report.postId!);
    
    const confirmationMessage = isCurrentlyHidden
      ? `Are you sure you want to unhide post #${report.postId}?`
      : `Are you sure you want to HIDE post #${report.postId}? This will hide it immediately.`;
    
    this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: `${action.toUpperCase()} POST`,
        message: confirmationMessage,
        confirmText: action.toUpperCase(),
        cancelText: 'CANCEL',
        type: isCurrentlyHidden ? 'success' : 'danger'
      }
    }).afterClosed().pipe(take(1)).subscribe(dialogResult => {
      if (dialogResult) {
        request.pipe(take(1)).subscribe({
          next: () => {
            this.snackBar.open(`Post ${action} successful!`, 'Close', { duration: 2000 });
            
            // Update local POSTS state directly
            this.posts.update(posts => posts.map(p => 
              p.id === report.postId ? { ...p, isHidden: !isCurrentlyHidden } as AdminPost : p
            ));
            report.postHidden = !isCurrentlyHidden;
          },
          error: () => {
            this.snackBar.open(`Failed to ${action} post.`, 'Close', { duration: 3000 });
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
