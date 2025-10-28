import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { PostService } from '../../services/post.service';
import { CommentService } from '../../services/comment.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Post } from '../../../../core/models/post.interface';
import { Comment, CreateCommentRequest } from '../../../../core/models/comment.interface';
import { ConfirmationDialogComponent } from '../../../../shared/components/confirmation-dialog/confirmation-dialog.component';
import { TimeAgoPipe } from '../../../../shared/pipes/time-ago-pipe';
import { MarkdownModule } from 'ngx-markdown';
import { CommentsSectionComponent } from '../comments-section/comments-section.component';
import { ReportDialogComponent } from '../../../reporting/components/report-dialog/report-dialog.component';
import { take } from 'rxjs';
import { CreateReportRequest } from '../../../../core/models/report.interface';
import { ReportService } from '../../../reporting/services/report.service';

@Component({
  selector: 'app-post-detail',
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatFormFieldModule,
    MatInputModule,
    MatDividerModule,
    MatMenuModule,
    MatDialogModule,
    TimeAgoPipe,
    MarkdownModule,
    CommentsSectionComponent,
  ],
  templateUrl: './post-detail.component.html',
  styleUrl: './post-detail.component.scss',
})
export class PostDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly postService = inject(PostService);
  private readonly commentService = inject(CommentService);
  private readonly authService = inject(AuthService);
  private readonly snackBar = inject(MatSnackBar);
  private readonly dialog = inject(MatDialog);
  private readonly reportService = inject(ReportService);



  // Signals
  readonly post = signal<Post | null>(null);
  readonly comments = signal<Comment[]>([]);
  readonly isLoadingPost = signal(false);
  readonly isLoadingComments = signal(false);
  readonly isSubmittingComment = signal(false);
  readonly error = signal<string | null>(null);
  readonly commentCursor = signal(0);
  readonly hasMoreComments = signal(true);

  // Computed
  readonly currentUser = this.authService.currentUser;
  readonly isAuthor = computed(() => {
    const post = this.post();
    const user = this.currentUser();
    return post && user && post.user.id === user.id;
  });

  // Comment form
  commentForm: FormGroup;

  constructor() {
    this.commentForm = this.fb.group({
      content: ['', [Validators.required, Validators.maxLength(500)]],
    });
  }

  ngOnInit(): void {
    const postId = this.route.snapshot.params['id'];
    if (postId) {
      this.loadPost(+postId);
      this.loadComments();
    }
  }

  loadPost(postId: number): void {
    this.isLoadingPost.set(true);
    this.error.set(null);

    this.postService.getPostById(postId).subscribe({
      next: (response) => {
        if (response) {
          this.post.set(response);
        }
        this.isLoadingPost.set(false);
      },
      error: (err) => {
        this.error.set(err.error?.message || 'Failed to load post');
        this.isLoadingPost.set(false);
        this.snackBar.open('Failed to load post', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });

    console.log('Loading post with ID:', this.post());
  }

  loadComments(): void {
    if (!this.hasMoreComments()) return;
    let postId = this.route.snapshot.params['id'];
    this.isLoadingComments.set(true);

    this.commentService.getCommentsByPost(postId, this.commentCursor()).subscribe({
      next: (response) => {
        if (response) {
          if (this.commentCursor() > 0) {
            // Append new comments for pagination

            this.comments.update((current) => [...current, ...response]);
          } else {
            // Initial load
            this.comments.set(response);
          }
          // this.comments.set(response);
          if (response.length > 0) {
            this.commentCursor.set(response[response.length - 1]?.id);
          } else {
            this.hasMoreComments.set(false);
          }
        }
        this.isLoadingComments.set(false);
      },
      error: (err) => {
        this.isLoadingComments.set(false);
        console.error('Failed to load comments:', err);
      },
    });
  }

  onGetReplies(comment: Comment): void {
    // Handle getting replies for a specific comment
    console.log('Getting replies for comment ID:', comment.id);

    if (comment.replies && comment.replies.length >= comment.repliesCount) return;
    
    this.getReplies(comment);

  }
  onReportPost(): void {
    const post = this.post();
    if (!post) return;

    const dialogRef = this.dialog.open(ReportDialogComponent, {
      width: '500px',
      data: {
        type: 'Post',
        targetName: post.title.substring(0, 50) + '...'
      }
    });

    dialogRef.afterClosed().pipe(take(1)).subscribe(reason => {
      if (reason) {
        const request: CreateReportRequest = {
          reportedPostId: post.id,
          reportedUserId: post.user.id,
          reason: reason
        };
        this.reportService.createReport(request).subscribe({
          next: () => {
            this.snackBar.open('Post reported successfully. Our moderators will review it.', 'Close', { duration: 3000 });
          },
          error: () => {
            this.snackBar.open('Failed to submit report. Please try again.', 'Close', { duration: 3000, panelClass: ['error-snackbar'] });
          }
        });
      }
    });
  }


  getReplies(comment: Comment): void {
    if (!comment.replies){
      comment.replies = [];
    }
    this.commentService.getReplies(comment.id, comment.replies[comment.replies.length - 1]?.id).subscribe({
      next: (replies) => {
          let newReplies = [...(comment.replies || []), ...replies];
          // comment.replies = newReplies;
          // // console.log("new replies", newReplies);
          // this.comments.update((current) =>
          //   current.map(c => c.id === comment.id ? { ...c, replies: newReplies } : c)
          // );
          this.updateCommentInTree(comment.id, (c) => ({
          ...c,
          replies: newReplies,
        }));
      },
      error: (err) => {
        console.error('Failed to get replies:', err);
      },
    });
  }


  onLikePost(): void {
    const post = this.post();
    if (!post) return;

    const isLiked = post.isLiked || false;
    this.postService.likePost(post.id).subscribe({
      next: () => {
        // Update post locally
        this.post.update((current) => {
          if (!current) return current;
          return {
            ...current,
            isLiked: !isLiked,
            likesCount: isLiked ? current.likesCount - 1 : current.likesCount + 1,
          };
        });
      },
      error: () => {
        this.snackBar.open('Failed to update like', 'Close', {
          duration: 3000,
          panelClass: ['error-snackbar'],
        });
      },
    });
  }

  // onSubmitComment(): void {
  //   if (this.commentForm.invalid) {
  //     this.commentForm.markAllAsTouched();
  //     return;
  //   }

  //   const post = this.post();
  //   if (!post) return;

  //   this.isSubmittingComment.set(true);

  //   const request: CreateCommentRequest = {
  //     content: this.commentForm.value.content,
  //     postId: post.id
  //   };

  //   this.commentService.createComment(post.id,request).subscribe({
  //     next: (response) => {
  //       if (response) {
  //         // Add new comment to list
  //         this.comments.update(current => [response!, ...current]);

  //         // Update post comment count
  //         this.post.update(current => {
  //           if (!current) return current;
  //           return { ...current, commentsCount: current.commentsCount + 1 };
  //         });

  //         // Reset form
  //         this.commentForm.reset();

  //         this.snackBar.open('Comment added successfully!', 'Close', {
  //           duration: 2000,
  //           panelClass: ['success-snackbar']
  //         });
  //       }
  //       this.isSubmittingComment.set(false);
  //     },
  //     error: () => {
  //       this.snackBar.open('Failed to add comment', 'Close', {
  //         duration: 3000,
  //         panelClass: ['error-snackbar']
  //       });
  //       this.isSubmittingComment.set(false);
  //     }
  //   });
  // }

  onEditPost(): void {
    const post = this.post();
    if (!post) return;
    this.router.navigate(['/posts/edit', post.id]);
  }

  onDeletePost(): void {
    const post = this.post();
    if (!post) return;

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Post',
        message: 'Are you sure you want to delete this post? This action cannot be undone.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && post) {
        this.postService.deletePost(post.id).subscribe({
          next: () => {
            this.snackBar.open('Post deleted successfully', 'Close', {
              duration: 2000,
              panelClass: ['success-snackbar'],
            });
            this.router.navigate(['/home']);
          },
          error: () => {
            this.snackBar.open('Failed to delete post', 'Close', {
              duration: 3000,
              panelClass: ['error-snackbar'],
            });
          },
        });
      }
    });
  }

  isCommentAuthor(comment: Comment): boolean {
    const user = this.currentUser();
    return user ? comment.user.id === user.id : false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }

  getMediaUrl(url: string | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `http://localhost:8080/api/${url}`;
  }

  getAuthorInitials(fullName: string): string {
    const names = fullName.split(' ');
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return fullName[0]?.toUpperCase() || 'U';
  }

  onSubmitComment(content: string): void {
    const post = this.post();
    if (!post) return;

    this.isSubmittingComment.set(true);
    const request: CreateCommentRequest = { content, postId: post.id };

    this.commentService.createComment(post.id, request).subscribe({
      next: (response) => {
        if (response) {
          this.comments.update((current) => [response, ...current]);
          this.post.update((current) =>
            current ? { ...current, commentsCount: current.commentsCount + 1 } : current
          );
          this.snackBar.open('Comment added!', 'Close', { duration: 2000 });
        }
        this.isSubmittingComment.set(false);
      },
      error: () => {
        this.snackBar.open('Failed to add comment', 'Close', { duration: 3000 });
        this.isSubmittingComment.set(false);
      },
    });
  }

  onLikeComment(comment: Comment): void {
    console.log('Liking comment ID:', comment.id);
    // co
    
    this.commentService.likeComment(comment.id).subscribe({
      next: () => {
        // comment.isLiked = !comment.isLiked;
        // // Update likes count
        // comment.likesCount = comment.isLiked
        //   ? (comment.likesCount || 0) + 1
        //   : Math.max(0, (comment.likesCount || 1) - 1);
        // Update comment in the tree
        this.updateCommentInTree(comment.id, (c) => ({
          ...c,
          isLiked: !c.isLiked,
          likesCount: c.isLiked ? (c.likesCount || 1) - 1 : (c.likesCount || 0) + 1,
        }));
      },
      error: () => {
        this.snackBar.open('Failed to like comment', 'Close', { duration: 3000 });
      },
    });
  }

  // Helper methods for tree manipulation
  private updateCommentInTree(id: number, updateFn: (comment: Comment) => Comment): void {
    this.comments.update((comments) => this.updateCommentRecursive(comments, id, updateFn));
  }

  private updateCommentRecursive(
    comments: Comment[],
    id: number,
    updateFn: (comment: Comment) => Comment
  ): Comment[] {
    return comments.map((comment) => {
      if (comment.id === id) {
        return updateFn(comment);
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.updateCommentRecursive(comment.replies, id, updateFn),
        };
      }
      return comment;
    });
  }

  private addReplyToTree(parentId: number, reply: Comment): void {
    this.comments.update((comments) => this.addReplyRecursive(comments, parentId, reply));
  }

  private addReplyRecursive(comments: Comment[], parentId: number, reply: Comment): Comment[] {
    return comments.map((comment) => {
      if (comment.id === parentId) {
        return {
          ...comment,
          replies: [reply, ...(comment.replies || [])],
          repliesCount: (comment.repliesCount || 0) + 1,
        };
      }
      if (comment.replies && comment.replies.length > 0) {
        return {
          ...comment,
          replies: this.addReplyRecursive(comment.replies, parentId, reply),
        };
      }
      return comment;
    });
  }

  private removeCommentFromTree(commentId: number): void {
    this.comments.update((comments) => this.removeCommentRecursive(comments, commentId));
  }

private removeCommentRecursive(comments: Comment[], id: number): Comment[] {
  // Go through each comment to see if it's the one to remove or if it's a parent
  return comments
    .filter(comment => comment.id !== id) // Remove the comment if it's at the current level
    .map(comment => {
      // If the comment doesn't have replies, we're done with it
      if (!comment.replies || comment.replies.length === 0) {
        return comment;
      }

      // Keep track of the original number of replies
      const originalRepliesLength = comment.replies.length;
      
      // Recursively try to remove the comment from the children
      const newReplies = this.removeCommentRecursive(comment.replies, id);

      // If a direct child was removed, the array length will be smaller
      if (newReplies.length < originalRepliesLength) {
        // A child was removed, so update this direct parent
        return {
          ...comment,
          replies: newReplies,
          // Decrease the count by exactly 1
          repliesCount: (comment.repliesCount || 1) - 1,
        };
      }

      // If no children were removed, return the comment unchanged
      return {
        ...comment,
        replies: newReplies,
      };
  });
}

  onReplyToComment(data: { parentId: number; content: string }): void {
    const post = this.post();
    if (!post) return;

    const request: CreateCommentRequest = {
      content: data.content,
      postId: post.id,
      parentId: data.parentId,
    };

    this.commentService.createComment(post.id, request).subscribe({
      next: (response) => {
        if (response) {
          this.addReplyToTree(data.parentId, response);
          this.post.update((current) =>
            current ? { ...current, commentsCount: current.commentsCount + 1 } : current
          );
          this.snackBar.open('Reply added!', 'Close', { duration: 2000 });
        }
      },
      error: () => {
        this.snackBar.open('Failed to add reply', 'Close', { duration: 3000 });
      },
    });
  }

  onEditComment(data: { commentId: number; content: string }): void {
    this.commentService.updateComment(data.commentId,  data.content ).subscribe({
      next: () => {
        this.updateCommentInTree(data.commentId, (c) => ({
          ...c,
          content: data.content,
          updatedAt: new Date().toISOString(),
        }));
        this.snackBar.open('Comment updated!', 'Close', { duration: 2000 });
      },
      error: () => {
        this.snackBar.open('Failed to update comment', 'Close', { duration: 3000 });
      },
    });
  }

  onDeleteComment(comment: Comment): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete Comment',
        message: 'Are you sure you want to delete this comment? All replies will also be deleted.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.commentService.deleteComment(comment.id).subscribe({
          next: () => {
            this.removeCommentFromTree(comment.id);

            // Update post comment count (including all nested replies)
            const deletedCount = this.countCommentAndReplies(comment);
            this.post.update((current) =>
              current
                ? { ...current, commentsCount: Math.max(0, current.commentsCount - deletedCount) }
                : current
            );

            this.snackBar.open('Comment deleted successfully', 'Close', { duration: 2000 });
          },
          error: () => {
            this.snackBar.open('Failed to delete comment', 'Close', { duration: 3000 });
          },
        });
      }
    });
  }

  

  private countCommentAndReplies(comment: Comment): number {
    let count = 1; // Count the comment itself
    if (comment.replies && comment.replies.length > 0) {
      comment.replies.forEach((reply) => {
        count += this.countCommentAndReplies(reply);
      });
    }
    return count;
  }
}
